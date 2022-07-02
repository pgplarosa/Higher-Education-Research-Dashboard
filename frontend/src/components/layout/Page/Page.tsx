import styles from './Page.module.scss';
import { COLOR_GROUPS, COLOR_MAPPING } from '../../../services/colorService';

export const Page = (props) => {
    return (
        <div className={styles.component}>
            <div
                className={styles.header}
                style={{
                    color: COLOR_MAPPING[COLOR_GROUPS.BASIC_GREEN][4],
                }}
            >
                {/* <FolderIcon
                    sx={{
                        fontSize: '5rem',
                        verticalAlign: 'center',
                    }}
                /> */}
                {props.icon}
                <div className="title-group">
                    <h1>{props.mainTitle}</h1>
                    <h2>{props.subtitle}</h2>
                </div>
            </div>

            <div className="content">{props.children}</div>
        </div>
    );
};
