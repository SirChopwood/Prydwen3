const randomWeightedChoice = (
    table: Array<{weight: number, value: string}>,
    temperature = 50, // in [0,100], 50 is neutral
    randomFunction = Math.random,
    influence = 2 // seems fine, hard to tune
) => {
    const T = (temperature - 50) / 50;
    const nb = table.length;
    if (!nb) {
        return null;
    }

    const total = table.reduce(
        (previousTotal, element) => previousTotal + element.weight,
        0
    );

    const avg = total / nb;

    // Compute amplified urgencies (depending on temperature)
    const ur: Record<string, number> = {};
    const urgencySum = table.reduce((previousSum, element) => {
        const { value, weight } = element;
        let urgency = weight + T * influence * (avg - weight);
        if (urgency < 0) urgency = 0;
        ur[value] = (ur[value] || 0) + urgency;
        return previousSum + urgency;
    }, 0);

    let currentUrgency = 0;
    const cumulatedUrgencies: Record<string, number> = {};
    Object.keys(ur).forEach((value) => {
        currentUrgency += ur[value];
        cumulatedUrgencies[value] = currentUrgency;
    });

    if (urgencySum <= 0) return null; // No weight given
    // Choose
    const choice = randomFunction() * urgencySum;
    const values = Object.keys(cumulatedUrgencies);
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        const urgency = cumulatedUrgencies[value];
        if (choice <= urgency) {
            return value;
        }
    }
};

export default randomWeightedChoice