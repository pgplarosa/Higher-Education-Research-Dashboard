////////////////////////////////////////////////////////
//                       UTILITIES                    //
////////////////////////////////////////////////////////

export const decompose = (data: Record<string, any>) => {
    const labels = [];
    const values = [];

    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            labels.push(key);
            values.push(value);
        });
    }

    return {
        labels,
        values,
    };
};
