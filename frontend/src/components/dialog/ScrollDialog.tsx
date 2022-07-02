import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import HorizontalBarChart from '../charts/horizontal-bar-chart/HorizontalBarChart';

export default function ScrollDialog(props) {
    const handleClose = () => {
        props.onClose();
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (props.openDialog) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [props.openDialog]);

    return (
        <div>
            <Dialog
                open={props.openDialog}
                onClose={handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth={true}
                maxWidth={'xl'}
            >
                <DialogTitle id="scroll-dialog-title">
                    {props.dialogData.title}
                </DialogTitle>
                <DialogContent>
                    <HorizontalBarChart
                        data={props.dialogData.data}
                    ></HorizontalBarChart>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
