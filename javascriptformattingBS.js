function maxSim(query, passage) {
    return query.map(q => {
        return passage.map(p => {
            return p.reduce((a, b, i) => {
                return a + b * q[i];
            }, 0)
        }).reduce((a, b) => {
            return a > b ? a : b;
        }, -Number.MAX_VALUE)
    }).reduce((a, b) => {
        return a + b;
    }, 0)
}