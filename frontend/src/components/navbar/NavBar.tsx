import styles from './NavBar.module.scss';
import HERD_LOGO from '../../assets/HERD_Logo.png';
import HERD_NAME from '../../assets/HERD_Name.png';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NAVIGATION_ITEMS } from '../../App.references';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

const ACCORDION_STYLE = {
    backgroundColor: 'transparent',
    color: 'white',
};

export const NavBar = (props) => {
    return (
        <div className={styles.component}>
            <div className={styles.logo}>
                <img src={HERD_LOGO} className={styles.main_logo} alt="" />
                <img src={HERD_NAME} className={styles.main_name} alt="" />
            </div>
            <div className={styles.menu}>
                {NAVIGATION_ITEMS.map((item) => {
                    return (
                        <Accordion sx={ACCORDION_STYLE} key={item.displayText}>
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon
                                        sx={{
                                            color: 'white',
                                        }}
                                    />
                                }
                                aria-controls="panel1a-content"
                                sx={{
                                    padding: '15px 15px',
                                    paddingBottom: '5px',
                                }}
                            >
                                <Typography
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '20px',
                                    }}
                                >
                                    {item.icon}
                                    {item.displayText}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    padding: '0px',
                                }}
                            >
                                <List>
                                    {item.children.map((child) => {
                                        return (
                                            child.displayed && (
                                                <Link
                                                    to={
                                                        '/' +
                                                        child.path.join('/')
                                                    }
                                                    key={child.displayText}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: 'white',
                                                    }}
                                                >
                                                    <ListItem
                                                        sx={{
                                                            padding: '0px',
                                                        }}
                                                    >
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                {child.icon}
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    child.displayText
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                </Link>
                                            )
                                        );
                                    })}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </div>
        </div>
    );
};
