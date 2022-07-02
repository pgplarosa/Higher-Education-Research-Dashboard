export const renderTitle = (
    title: string,
    styles?: string[],
): null | JSX.Element => {
    return title && <h2 className={`title ${styles?.join(' ')}`}>{title}</h2>;
};

export const renderDescription = (
    description: string,
    styles?: string[],
): null | JSX.Element => {
    return (
        description && (
            <p className={`description ${styles?.join(' ')}`}>{description}</p>
        )
    );
};

// ChartJS related utility functions
