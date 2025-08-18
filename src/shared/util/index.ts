const RegexCache = new Map();
const MatchCache = new Map<string, boolean>();
const util = {
    match(text: string, pattern: string) {
        const cacheKey = `${text}::${pattern}`;
        if (MatchCache.has(cacheKey)) {
            return MatchCache.get(cacheKey)!;
        }

        // Simple patterns
        if (pattern.indexOf("?") == -1) {
            // Exact match (eg. "prefix.event")
            const firstStarPosition = pattern.indexOf("*");
            if (firstStarPosition == -1) {
                const result = pattern === text;
                MatchCache.set(cacheKey, result);
                return result;
            }

            // Eg. "prefix**"
            const len = pattern.length;
            if (len > 2 && pattern.endsWith("**")) {
                const prefix = pattern.substring(0, len - 2);
                const result = text.startsWith(prefix);
                MatchCache.set(cacheKey, result);
                return result;
            }

            // Eg. "prefix*"
            if (len > 1 && pattern.endsWith("*")) {
                const prefix = pattern.substring(0, len - 1);
                if (text.startsWith(prefix)) {
                    const result = text.indexOf(".", len) == -1;
                    MatchCache.set(cacheKey, result);
                    return result;
                }
                return false;
            }

            // Accept simple text, without point character (*)
            if (len == 1 && firstStarPosition == 0) {
                const result = text.indexOf(".") == -1;
                MatchCache.set(cacheKey, result);
                return result;
            }

            // Accept all inputs (**)
            if (
                len == 2 &&
                firstStarPosition == 0 &&
                pattern.lastIndexOf("*") == 1
            ) {
                MatchCache.set(cacheKey, true);
                return true;
            }
        }

        // Regex (eg. "prefix.ab?cd.*.foo")
        const origPattern = pattern;
        let regex = RegexCache.get(origPattern);
        if (regex == null) {
            if (pattern.startsWith("$")) {
                pattern = "\\" + pattern;
            }
            pattern = pattern.replace(/\?/g, ".");
            pattern = pattern.replace(/\*\*/g, "§§§");
            pattern = pattern.replace(/\*/g, "[^\\.]*");
            pattern = pattern.replace(/§§§/g, ".*");

            pattern = "^" + pattern + "$";

            // eslint-disable-next-line security/detect-non-literal-regexp
            regex = new RegExp(pattern, "");
            RegexCache.set(origPattern, regex);
        }
        return regex.test(text);
    },
};

export default util;
