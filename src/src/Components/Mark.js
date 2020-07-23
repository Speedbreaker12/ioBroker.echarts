import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import I18n from '@iobroker/adapter-react/i18n';

import {IOTextField,IOCheckbox,IOColorPicker,IOSelect,IOObjectField} from './Fields';

import {MdDelete as IconDelete} from 'react-icons/md';
import {MdModeEdit as IconEdit} from 'react-icons/md';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';

import {FaFolder as IconFolderClosed} from 'react-icons/all';
import {FaFolderOpen as IconFolderOpened} from 'react-icons/all';

const WIDTHS = {
    lineId: 100,
    upperValueOrId: 100,
    lowerValueOrId: 100,
    color: 100,
    fill: 100,
    text: 200,
    buttons: 100
};

let styles = theme => ({
    card: {
        borderStyle: 'dashed',
        borderWidth: 1,
        marginBottom: theme.spacing(1),
        padding: theme.spacing(1),
        borderColor: theme.palette.grey['600'],
        overflow: 'initial'
    },
    shortFields: {
        display: 'block',
        '& > div': {
            display: 'inline-flex',
            paddingRight: '20px',
            width: '200px'
        }
    },
    shortLineIdField: {
        display: 'inline-flex',
        minWidth: WIDTHS.lineId,
        marginLeft: theme.spacing(1),
        paddingTop: 0,
        lineHeight: '48px',
        verticalAlign: 'top',
        paddingRight: '10px'
    },
    shortUpperValueOrIdField: {
        display: 'inline-flex',
        minWidth: WIDTHS.upperValueOrId,
        paddingTop: 0,
        lineHeight: '48px',
        verticalAlign: 'top',
        paddingRight: '10px'
    },
    shortLowerValueOrIdField: {
        lineHeight: '48px',
        display: 'inline-flex',
        minWidth: WIDTHS.lowerValueOrId,
        marginLeft: theme.spacing(1),
        paddingTop: 0,
        verticalAlign: 'top',
        paddingRight: '10px'
    },
    shortColorField: {
        display: 'inline-flex',
        minWidth: WIDTHS.color,
        marginLeft: theme.spacing(1),
        paddingTop: 0,
        lineHeight: '48px',
        verticalAlign: 'top',
        paddingRight: '10px'
    },
    shortFillField: {
        display: 'inline-flex',
        width: WIDTHS.fill,
        marginLeft: theme.spacing(1),
        paddingTop: 0,
        lineHeight: '48px',
        verticalAlign: 'top',
        paddingRight: '10px'
    },
    shortTextField: {
        display: 'inline-flex',
        minWidth: WIDTHS.text,
        marginLeft: theme.spacing(1),
        paddingTop: 0,
        lineHeight: '48px',
        verticalAlign: 'top',
        paddingRight: '10px'
    },
    shortButtonsField: {
        display: 'inline-flex',
        minWidth: WIDTHS.buttons,
        marginLeft: theme.spacing(1),
        paddingTop: 0,
        lineHeight: '48px',
        verticalAlign: 'top',
    },
    lineClosed: {
        display: 'inline-flex',
        flexFlow: 'column wrap',
        overflow: 'hidden',
        flexDirection: 'row',
        flex: 1,
        height: '48px'
    },
    lineClosedContainer: {
        display: 'flex'
    }
});

class Mark extends React.Component {
    state = {
        /*
            'lineId':'0',
            'upperValueOrId':'20',
            'fill':'1',
            'color':'#FF0000',
            'ol':'1',
            'os':'0',
            'text':'11',
            'textPosition':'l',
            'textOffset':'2',
            'textColor':'#FF0000',
            'textSize':'2',
            'lowerValueOrId':'20'
        */
      };

    updateField = (name, value)=>{
        let newMark = update(this.props.mark, {[name]: {$set: value}});
        this.props.updateMark(this.props.index, newMark);
    }

    renderClosedLine(lines) {
        return <div className={this.props.classes.lineClosedContainer}>
            <div className={this.props.classes.lineClosed}>
                <IconButton
                    title={ I18n.t('Edit') }
                    onClick={() => this.props.markOpenToggle(this.props.index)}>
                    <IconFolderClosed/>
                </IconButton>
                <IOSelect 
                    formData={this.props.mark} 
                    updateValue={this.updateField} 
                    name="lineId" 
                    label="Line ID" 
                    options={lines}
                    classes={{fieldContainer: this.props.classes.shortLineIdField}}
                    minWidth={WIDTHS.lineId}
                />
                <IOObjectField 
                    formData={this.props.mark} 
                    updateValue={this.updateField} 
                    name="upperValueOrId" 
                    label="Upper value or ID" 
                    socket={this.props.socket} 
                    classes={{fieldContainer: this.props.classes.shortUpperValueOrIdField}}
                    minWidth={WIDTHS.upperValueOrId}
                />
                <IOObjectField 
                    formData={this.props.mark} 
                    updateValue={this.updateField} 
                    name="lowerValueOrId" 
                    label="Lower value or ID" 
                    socket={this.props.socket} 
                    classes={{fieldContainer: this.props.classes.shortLowerValueOrIdField}}
                    minWidth={WIDTHS.lowerValueOrId}
                />
                <IOColorPicker 
                    formData={this.props.mark} 
                    updateValue={this.updateField} 
                    name="color" 
                    label="Color" 
                    classes={{fieldContainer: this.props.classes.shortColorField}}
                    minWidth={WIDTHS.color}
                />
                <IOCheckbox 
                    formData={this.props.mark} 
                    updateValue={this.updateField} 
                    name="fill" 
                    label="Fill"
                    classes={{fieldContainer: this.props.classes.shortFillField}}
                    minWidth={WIDTHS.dataType}
                />
                <IOTextField 
                    formData={this.props.mark} 
                    updateValue={this.updateField} 
                    name="text" 
                    label="Text"
                    classes={{fieldContainer: this.props.classes.shortTextField}}
                    minWidth={WIDTHS.fill}
                />
            </div>
            <IconButton
                size="small"
                style={{ marginLeft: 5 }} aria-label="Delete" title={I18n.t('Delete')}
                onClick={()=>{
                    this.props.deleteMark(this.props.index);
                }}>
                <IconDelete/>
            </IconButton>
        </div>
    }
    
    render() {
        let lines = {};
        this.props.presetData.lines.forEach((line, index) => {
            lines[index] = index + " - " + line.id;
        });
        return <Card className={this.props.classes.card}><CardContent>
            { this.props.opened ? <>
                <div>
                    <IconButton title={ I18n.t('Edit') }
                        onClick={() => this.props.markOpenToggle(this.props.index)
                    }><IconFolderOpened/></IconButton>
                    {I18n.t('Mark')} {this.props.index}{this.props.mark.text ? ' - ' + this.props.mark.text : ''}
                    <IconButton
                        size="small"
                        style={{ marginLeft: 5 }} aria-label="Delete" title={I18n.t('Delete')}
                        onClick={()=>{
                            this.props.deleteMark(this.props.index);
                        }}>
                        <IconDelete/>
                    </IconButton>
                </div>
                <div className={this.props.classes.shortFields}>
                    <IOSelect formData={this.props.mark} updateValue={this.updateField} name="lineId" label="Line ID" options={lines}/>
                    <IOObjectField formData={this.props.mark} updateValue={this.updateField} name="upperValueOrId" label="Upper value or ID" socket={this.props.socket} />
                    <IOObjectField formData={this.props.mark} updateValue={this.updateField} name="lowerValueOrId" label="Lower value or ID" socket={this.props.socket} />
                    <IOColorPicker formData={this.props.mark} updateValue={this.updateField} name="color" label="Color" />
                    <IOCheckbox formData={this.props.mark} updateValue={this.updateField} name="fill" label="Fill"/>
                    <IOTextField formData={this.props.mark} updateValue={this.updateField} name="ol" label="ØL" type="number"/>
                    <IOTextField formData={this.props.mark} updateValue={this.updateField} name="os" label="ØS" type="number"/>
                    <IOTextField formData={this.props.mark} updateValue={this.updateField} name="text" label="Text"/>
                    <IOSelect formData={this.props.mark} updateValue={this.updateField} name="textPosition" label="Text position" options={{
                        'l': 'Left',
                        'r': 'Right',
                    }}/>
                    <IOTextField formData={this.props.mark} updateValue={this.updateField} name="textOffset" label="Text offset" type="number"/>
                    <IOTextField formData={this.props.mark} updateValue={this.updateField} name="textSize" label="Text size" type="number"/>
                    <IOColorPicker formData={this.props.mark} updateValue={this.updateField} name="textColor" label="Text color" />
                </div>
            </> : this.renderClosedLine(lines)}
        </CardContent></Card>
    }
}

Mark.propTypes = {
    mark: PropTypes.object,
    socket: PropTypes.object,
    updateMark: PropTypes.func,
    index: PropTypes.number,
    opened: PropTypes.bool,
    instances: PropTypes.array,
    markOpenToggle: PropTypes.func,
};

export default withStyles(styles)(Mark);