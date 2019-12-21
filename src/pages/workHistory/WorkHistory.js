import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './WorkHistory.css'


const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    }
});


class WorkHistory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expandedPanel: 0
        };

        this.onChangeHandlerCache = {};
    }


    render() {

        const {classes} = this.props;
        const {onChangeHandlerCache} = this;

        const data = [
            {
                position: 'Cineplex VIP Bartender',
                description: defaultText
            },

            {
                position: 'Zara Sales Associate',
                description: defaultText
            },

            {
                position: 'Chatime Barista',
                description: defaultText
            },

            {
                position: 'El Catrin Bartender',
                description: defaultText
            }

        ];

        return (
            <div className='am-work-history'>
                <p className='am-work-history-main-title'>Work History</p>

                <div className={classes.root}>
                    {data.map((item, index) => {
                        const {position, description} = item;

                        if (!onChangeHandlerCache[index])
                            onChangeHandlerCache[index] = (event, expanded) => {
                                if (this.state.expandedPanel === index)
                                    this.setState({expandedPanel: null});
                                else
                                    this.setState({expandedPanel: index});
                            };

                        return (
                            <AccordionListItem
                                key={index}
                                id={index}
                                position={position}
                                description={description}
                                classes={classes}
                                isExpanded={index === this.state.expandedPanel}
                                onChange={onChangeHandlerCache[index]}
                            />);
                    })}
                </div>
            </div>
        );
    }

}

class AccordionListItem extends React.PureComponent {
    render() {
        const {id, position, description, classes, isExpanded, onChange} = this.props;
        return (
            <ExpansionPanel expanded={isExpanded} onChange={onChange}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${id}a-content`}
                    id={`panel${id}a-header`}
                >
                    <Typography className={classes.heading}>{position}</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>{description}</Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default withStyles(styles)(WorkHistory);

const defaultText = "In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non. In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non. In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n" +
    "                                ea in ut nostrud velit in irure cillum tempor laboris\n" +
    "                                sed adipisicing eu esse duis nulla non.In ad velit in ex nostrud dolore cupidatat consectetur\n";