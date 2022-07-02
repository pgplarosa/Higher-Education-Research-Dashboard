import SummarizeIcon from '@mui/icons-material/Summarize';
import FolderIcon from '@mui/icons-material/Folder';
import HiveIcon from '@mui/icons-material/Hive';
import SchoolIcon from '@mui/icons-material/School';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const ICON_STYLING = {
    padding: '0px',
    margin: '0px 20px',
    color: '#84b29e',
};

export interface NavigationItem {
    displayText: string;
    displayed: boolean;
    path?: string[];
    icon: any;
    children: NavigationItem[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        displayText: 'Research',
        displayed: true,
        path: [],
        icon: <FolderIcon />,
        children: [
            {
                displayText: 'Abstract Analysis',
                path: ['research', 'abstract-analysis'],
                icon: <SummarizeIcon sx={ICON_STYLING} />,
                children: [],
                displayed: true,
            },
            {
                displayText: 'Research Relevance',
                path: ['research', 'research-relevance'],
                icon: <WorkspacesIcon sx={ICON_STYLING} />,
                children: [],
                displayed: true,
            },
            {
                displayText: 'Patents',
                path: ['research', 'patents'],
                icon: <EmojiEventsIcon sx={ICON_STYLING} />,
                children: [],
                displayed: true,
            },
        ],
    },
    {
        displayText: 'Collaboration',
        displayed: true,
        path: [],
        icon: <PeopleIcon />,
        children: [
            {
                displayText: 'Faculty Profile',
                path: ['collaboration', 'profile'],
                icon: <SchoolIcon sx={ICON_STYLING} />,
                children: [],
                displayed: true,
            },

            {
                displayText: 'Co-authorship',
                path: ['collaboration', 'coauthorship'],
                icon: <HiveIcon sx={ICON_STYLING} />,
                children: [],
                displayed: true,
            },
            {
                displayText: 'Recommender',
                path: [],
                icon: <ConnectWithoutContactIcon sx={ICON_STYLING} />,
                children: [],
                displayed: false,
            },
        ],
    },
    {
        displayText: 'Metrics',
        displayed: true,
        path: [],
        icon: <EqualizerIcon />,
        children: [
            {
                displayText: 'Research Cost',
                path: ['metrics', 'research-cost'],
                icon: <AttachMoneyIcon sx={ICON_STYLING} />,
                children: [],
                displayed: true,
            },
            {
                displayText: 'Utilization',
                path: ['metrics', 'utilization'],
                icon: <SpeedIcon sx={ICON_STYLING} />,
                children: [],
                displayed: true,
            },
            {
                displayText: 'Regional Development',
                path: ['metrics', 'regional-development'],
                icon: <TrendingUpIcon sx={ICON_STYLING} />,
                children: [],
                displayed: true,
            },
        ],
    },
];
