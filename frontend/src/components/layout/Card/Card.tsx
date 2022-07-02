import React from 'react';
import styles from './Card.module.scss';

export const Card = (props) => {
    return (
        <div className={`${styles.card} margined padded-large`}>
            {props.children}
        </div>
    );
};
