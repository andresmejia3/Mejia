import React from "react";
import {withStyles} from "@material-ui/core";
import autoBind from 'react-autobind';
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import sjtLogo from  '../../assets/images/projects/sjt-logo.jpg';
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import FadeInModal from "../../components/FadeInModal/FadeInModal";
import sjtMockVideo from '../../assets/videos/SJTDemoCropped.mp4';
import './Projects.css';



class Projects extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
           visibleModal: 'none'
        };

        this.handlerCache = {};

        this.projects = [
            {
                name: 'SJT Connect',
                position: 'React Native Developer',
                languages: ['JavaScript'],
                packages: ['Heroku', 'Docker', 'React Native', 'Express.js', 'Redux', 'i18n.js', 'Realm Mobile Database'],
                description: 'Android app on the PlayStore - Worked on frontend/backend',
                image: sjtLogo,
                backgroundColor: '#fff'
            },
            {
                name: 'Plex Connect',
                position: 'React Native Developer',
                languages: ['JavaScript'],
                packages: ['React Native', 'Puppeteer.js', 'Redux'],
                description: 'Android app on the PlayStore - Worked on frontend/backend',
                image: sjtLogo,
                backgroundColor: '#fff'
            },
            {
                name: 'Node Network Animations',
                position: 'React Native Developer',
                languages: ['JavaScript'],
                packages: ['Pixi.js'],
                description: 'The home section of this website!',
                image: sjtLogo,
                backgroundColor: '#fff'
            },
            {
                name: 'Skills Display',
                position: 'React Native Developer',
                languages: ['JavaScript'],
                packages: ['p5.js'],
                description: 'The skills section of this website!',
                image: sjtLogo,
                backgroundColor: '#fff'
            },
            {
                name: 'Mejia.ca',
                position: 'React Native Developer',
                languages: ['JavaScript'],
                packages: ['React.js', 'Pixi.js', 'p5.js'],
                description: 'This website!',
                image: sjtLogo,
                backgroundColor: '#fff'
            }
        ];
    }

    render() {
        const {classes} = this.props;

        return (
            <div className='am-projects'>
                <p className='am-projects-main-title'>Projects</p>

                <div className={classes.root}>
                    {/*<GridList cellHeight={200} cols={3} className={classes.gridList}>*/}
                    <GridList cellHeight={200} cols={3}>
                        {this.projects.map(this._renderProjectDisplayCell)}

                    </GridList>
                </div>
            </div>
        )
    }

    _renderProjectDisplayCell(project, index) {
        const {classes} = this.props;
        const {handlerCache, _clearModal} = this;
        const {name, image, backgroundColor, position, languages, packages, description} = project;
        const isShowing = name === this.state.visibleModal;

        if (!handlerCache[name])
            handlerCache[name] = () => {
            console.log(`${name} WAS CLICKED`);
            this.setState({visibleModal: name});
        };

        return (
            <GridListTile key={index}>
                <ButtonBase
                    focusRipple
                    key={index}
                    className={classes.image}
                    focusVisibleClassName={classes.focusVisible}
                    onClick={handlerCache[name]}
                >
                    <img src={image} alt={name} style={{objectFit: 'contain', align: 'middle', width: '100%', height: '100%', backgroundColor}}/>
                    <span className={classes.imageBackdrop}/>
                    <span className={classes.imageButton}>
                        <Typography component="span" variant="h4" color="inherit" className={classes.imageTitle}>
                            {name}
                        </Typography>
                    </span>
                </ButtonBase>

                <FadeInModal projectName={name} isShowing={isShowing} closeModalHandler={_clearModal}>
                    <div style={{display: 'flex', borderRadius: 20, flexDirection: 'row', backgroundColor: 'white', verticalAlign: "top", padding: '0 2%'}}>
                            <div style={{
                                flex: 1,
                                // backgroundColor: 'blue',
                                // paddingRight: '5%'
                            }}>
                                <h1>{name}</h1>
                                <h3>Position: {position}</h3>
                                <h3 style={{marginBottom: 0, paddingBottom: 0}}>Description:</h3>
                                <p style={{paddingInlineStart: '20px', margin: 0}}>{description}</p>

                                <h3 style={{marginBottom: 0, paddingBottom: 0}}>Languages Used:</h3>

                                {languages.map((language) => <p style={{paddingInlineStart: 20,  margin: 0}}>{language}</p>)}


                                <h3 style={{marginBottom: 0, paddingBottom: 0}}>Libraries & Frameworks Used:</h3>

                                {packages.map((item) => <p style={{paddingInlineStart: 20, margin: 0}}>{item}</p>)}

                            </div>


                            <div style={{
                                flex: 1,
                                flexDirection: 'column',
                                // backgroundColor: 'red',
                                paddingBottom: '5%',
                                verticalAlign: 'top',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>
                                <h1>Demo</h1>
                                <video src={sjtMockVideo} height={window.innerHeight * 0.5} autoPlay controls/>
                            </div>
                    </div>
                </FadeInModal>
            </GridListTile>

        );
    }

    _clearModal() {
        this.setState({visibleModal: 'none'});
    }
}


const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
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
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.main,
    },
    gridList: {
        width: 500,
        height: 450,
    },

    // root: {
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     minWidth: 300,
    //     width: '100%',
    // },
    image: {
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        fontWeight: 'bold',
        position: 'relative',
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
    }
});

export default withStyles(styles)(Projects)