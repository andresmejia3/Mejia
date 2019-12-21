import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const styles = theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
});

class FadeInModal extends React.PureComponent {

    render() {

        const {classes, children, isShowing, projectName, closeModalHandler} = this.props;

        return (
            <Modal
                aria-labelledby={`${projectName} project demo modal`}
                aria-describedby={`${projectName} project demo description`}
                className={classes.modal}
                open={isShowing}
                onClose={closeModalHandler}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: 500,}}
            >
                <Fade in={isShowing}>
                    {/*<div className={classes.paper}>*/}
                        {children}
                    {/*</div>*/}
                </Fade>

            </Modal>
        );
    }
}

export default withStyles(styles)(FadeInModal);