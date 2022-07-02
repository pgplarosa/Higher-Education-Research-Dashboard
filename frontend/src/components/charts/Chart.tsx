import { ChartProps } from './charts.model';
import { renderDescription, renderTitle } from './utils';
import styles from './Chart.module.scss';

export const Chart: React.FunctionComponent<
    React.PropsWithChildren<ChartProps>
> = (props) => {
    return (
        <div className="padded-regular">
            {renderTitle(props.title, [styles.title])}
            {renderDescription(props.description, [styles.description])}
            {props.children}
        </div>
    );
};
