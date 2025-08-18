import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { User } from "../entities/user.entity";
import { ConflictException } from "../presentation/common";
import { LoginUserInputs } from "../presentation/validator/auth/loginUserSchema";
import { RegisterUserInputs } from "../presentation/validator/auth/registerUserSchema";
import { UserRepository } from "../repositories/UserRepository";
import { API_MESSAGES, REPOSITORY_TOKENS } from "../shared/constants";
import { compare, hash } from "../shared/helper/auth.helper";
import JwtHelper from "../shared/helper/jwt.helper";
import { TransactionService } from "./TransactionService";

@Injectable()
export default class AuthService {
    private userRepository: UserRepository;
    private transactionService: TransactionService;
    private jwtHelper: JwtHelper;

    constructor(
        @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
        userRepository: UserRepository,
        transactionService: TransactionService,
        jwtHelper: JwtHelper,
    ) {
        this.userRepository = userRepository;
        this.transactionService = transactionService;
        this.jwtHelper = jwtHelper;
    }

    async register(
        request: RegisterUserInputs,
    ): Promise<{ message: string; userId: string }> {
        const { name, email, password } = request;

        const transaction = this.transactionService.createTransaction();
        try {
            transaction.startTransaction();
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new ConflictException(API_MESSAGES.USER.EMAIL_EXISTS);
            }

            const hashedPassword = await hash(password);

            const user = User.createNew(name, email, hashedPassword);
            await this.userRepository.save(user);
            await transaction.commitTransaction();

            return {
                message: "User registered successfully",
                userId: user.getId(),
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            await transaction.rollbackTransaction();
            throw new InternalServerErrorException("Failed to register user");
        }
    }

    async login(request: LoginUserInputs) {
        const { email, password } = request;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Email or password is incorrect");
        }

        // generate JWT token
        const userId = user.id;
        const accessToken = this.jwtHelper.generateAccessToken(userId);
        const refreshToken = this.jwtHelper.generateRefreshToken(userId);

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    public async ensureAuthenticated(
        accessToken: string,
        refreshToken: string,
    ) {
        const decodedAccessToken = await this.jwtHelper
            .verifyAccessToken(accessToken)
            .catch((err) => {
                if (err.name !== "TokenExpiredError") {
                    throw new Error("Invalid access token");
                }
            });

        const decodedRefreshToken = await this.jwtHelper
            .verifyRefreshToken(refreshToken)
            .catch(() => {
                throw new Error("Invalid refresh token");
            });

        let finalAccessToken = accessToken;
        let finalRefreshToken = refreshToken;
        if (!decodedAccessToken) {
            // rotate tokens
            finalAccessToken = this.jwtHelper.generateAccessToken(
                decodedRefreshToken.userId,
            );
            finalRefreshToken = this.jwtHelper.generateRefreshToken(
                decodedRefreshToken.userId,
            );
        }

        const userId = decodedRefreshToken.userId;
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("UnAuthenticated user");
        }

        return {
            accessToken: finalAccessToken,
            refreshToken: finalRefreshToken,
            user,
        };
    }
}
