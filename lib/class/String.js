
/**
 * modified distance algorithm borrowed from:
 * @link https://de.wikipedia.org/wiki/Levenshtein-Distanz
 * @param {string} otherString
 * @param {number} [limit]
 * @returns {number}
 */
String.prototype.distance = function (otherString, limit) {

    var strA = this;
    var strB = otherString;

    limit = limit || 32;

    var strALength = strA.length, strBLength = strB.length;

    var max_len = 0;
    if (strALength > strBLength)
        max_len = strALength + 1;
    else
        max_len = strBLength + 1;

    var matrix = [];
    for (var i = 0; i < max_len; i++) {
        matrix[i] = [i];
        matrix[i].length = max_len;
    }
    for (var i = 0; i < max_len; i++) {
        matrix[0][i] = i;
    }

    if (Math.abs(strALength - strBLength) > (limit || 32))
        return limit || 32;
    if (strALength === 0)
        return strBLength;
    if (strBLength === 0)
        return strALength;

    // Calculate matrix
    var strA_i, strB_j, cost, min, t;
    for (i = 1; i <= strALength; ++i) {
        strA_i = strA[i - 1];

        for (var j = 1; j <= strBLength; ++j) {
            if (i === j && matrix[i][j] > 4)
                return strALength;

            strB_j = strB[j - 1];
            cost = (strA_i === strB_j) ? 0 : 1;
            // Calculate the minimum (much faster than Math.min(...)).
            min = matrix[i - 1][j] + 1;                      // Deletion.
            if ((t = matrix[i][j - 1] + 1) < min)
                min = t;   // Insertion.
            if ((t = matrix[i - 1][j - 1] + cost) < min)
                min = t;   // Substitution.

            matrix[i][j] = min;     // Update matrix.
        }
    }

    var dist1 = matrix[strALength][strBLength];

    var dist2 = 9999999999999;
    var aIsInB = strB.indexOf(strA) >= 0;
    var bIsInA = strA.indexOf(strB) >= 0;
    if (aIsInB || bIsInA) {
        var a = 0.25 * aIsInB;
        var b = 0.25 & bIsInA;
        var sub = a + b;
        dist2 = 1 - sub;
    }

    return Math.min(dist1, dist2);
};