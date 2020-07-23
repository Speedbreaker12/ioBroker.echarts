import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {withStyles} from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';

import {IOTextField, IOSelect, IOObjectField, IODateTimeField} from './Fields';
import I18n from '@iobroker/adapter-react/i18n';

import {IoMdTime as IconTime} from 'react-icons/all';
import {GrAggregate as IconAggregate} from 'react-icons/all';
import {FiRefreshCw as IconRefresh} from 'react-icons/all';
import {IoMdArrowDropdown as IconDropDown} from 'react-icons/all';

let styles = theme => ({
    mainDiv: {
        paddingLeft: 40,
    },
    fieldsContainer: {
        '& > div': {
            display: 'flex',
            paddingRight: 20,
            width: 200
        }
    },
    hintButton: {
        marginTop: 8,
        marginRight: 20,
        float: 'right'
    },
    popOver: {
        padding: theme.spacing(2)
    },
    refreshSelect: {
        display: 'inline-block',
        paddingLeft: 4,
        '& > div:before': {
            borderWidth: 0
        },
        '& > div:hover:before': {
            borderBottom: 0
        },
        marginLeft: theme.spacing(1),
    },
    refreshSelectButtonTitle: {
        display: 'inline-flex',
        paddingTop: 6,
    },
    settingsButton: {
        color: 'currentColor',
        fontSize: '16px'
    },
    grow1: {
        flexGrow: 1,
    }
});

const RefreshSelect = function (props) {
    return <div className={props.className}>
        <Select
            onChange={e => props.updateValue(props.name, e.target.value)}
            value={props.formData[props.name] || ''}
            renderValue={props.renderValue}
            displayEmpty
        >
            {
                props.options ?
                    Object.keys(props.options).map((key) =>
                        <MenuItem key={key} value={key}>{props.noTranslate ? props.options[key] : I18n.t(props.options[key])}</MenuItem>)
                        : null
            }
        </Select>
    </div>
};

const rangeOptions = {
    '10': '10 minutes',
    '30': '30 minutes',
    '60': '1 hour',
    '120': '2 hours',
    '180': '3 hours',
    '360': '6 hours',
    '720': '12 hours',
    '1440': '1 day',
    '2880': '2 days',
    '4320': '3 days',
    '10080': '7 days',
    '20160': '14 days',
    '1m': '1 month',
    '2m': '2 months',
    '3m': '3 months',
    '6m': '6 months',
    '1y': '1 year',
    '2y': '2 years',
};
const relativeEndOptions = {
    'now': 'now',
    '1minute': 'end of minute',
    '5minutes': 'end of 5 minutes',
    '10minutes': 'end of 10 minutes',
    '30minutes': 'end of 30 minutes',
    '1hour': 'end of hour',
    '2hours': 'end of 2 hours',
    '3hours': 'end of 3 hours',
    '4hours': 'end of 4 hours',
    '6hours': 'end of 6 hours',
    '8hours': 'end of 8 hours',
    '12hours': 'end of 12 hours',
    'today': 'end of day',
    'weekEurope': 'end of sunday',
    'weekUsa': 'end of saturday',
    'month': 'this month',
    'year': 'this year',
};
const liveOptions = {
    '': 'none',
    '5': '5 seconds',
    '10': '10 seconds',
    '15': '15 seconds',
    '20': '20 seconds',
    '30': '30 seconds',
    '60': '1 minute',
    '120': '2 minutes',
    '300': '5 minutes',
    '600': '10 minutes',
    '900': '15 minutes',
    '1200': '20 minutes',
    '1800': '30 minutes',
    '3600': '1 hour',
    '7200': '2 hours',
    '10800': '3 hours',
    '21600': '6 hours',
    '43200': '12 hours',
    '86400': '1 day',
};

class ChartSettings extends React.Component {
    state = {
        timeSpanOpened: false,
        aggregateOpened: false,
        refreshOpened: false
    }

    updateField = (name, value, time)=>{
        let updateObject = {[name]: {$set: value}};
        if (time) {
            updateObject[name + '_time'] = {$set: time};
            window.localStorage.setItem('Chart.' + name + '_time', time);
        }
        this.props.onChange(update(this.props.presetData, updateObject));
        window.localStorage.setItem('Chart.' + name, value);
    };

    render() {
        return <Toolbar className={this.props.classes.mainDiv} variant="dense">
            <IconButton
                title={ I18n.t('Time span') }
                size="small"
                className={this.props.classes.settingsButton}
                id="timeSpanOpenButton"
                onClick={() => {this.setState({timeSpanOpened: !this.state.timeSpanOpened})}}
            >
                <IconTime/>
                {
                    this.props.presetData.timeType === 'relative' ?
                    I18n.t(rangeOptions[this.props.presetData.range]) + ' ' + I18n.t('to') + ' ' + I18n.t(relativeEndOptions[this.props.presetData.relativeEnd]) :
                    this.props.presetData.start + ' ' + this.props.presetData.start_time + ' - ' + this.props.presetData.end + ' ' + this.props.presetData.end_time
                }
                <IconDropDown/>
            </IconButton>
            <Popover className={this.props.classes.popOver}
                open={this.state.timeSpanOpened}
                onClose={()=>{this.setState({timeSpanOpened: false})}}
                anchorEl={()=> document.getElementById('timeSpanOpenButton')}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={this.props.classes.popOver}>
                    <div className={this.props.classes.fieldsContainer}>
                        <IOSelect formData={this.props.presetData} updateValue={this.updateField} name="timeType" label="Type" options={{
                            'relative': 'relative',
                            'static': 'static',
                        }}/>
                        { this.props.presetData.timeType === 'static' ?
                            <>
                                <IODateTimeField formData={this.props.presetData} updateValue={this.updateField} name="start" label="Start" />
                                <IODateTimeField formData={this.props.presetData} updateValue={this.updateField} name="end" label="End" />
                            </> : <>
                                <IOSelect formData={this.props.presetData} updateValue={this.updateField} name="relativeEnd" label="End" options={relativeEndOptions}/>
                                <IOSelect formData={this.props.presetData} updateValue={this.updateField} name="range" label="Range" options={rangeOptions}/>
                            </>
                        }
                    </div>
                </div>
            </Popover>
            <IconButton
                title={ I18n.t('Aggregate') }
                size="small"
                className={this.props.classes.settingsButton}
                id="aggregateOpenButton"
                onClick={() => {this.setState({aggregateOpened: !this.state.aggregateOpened})}}
            >
                <IconAggregate/>
                {this.props.presetData['aggregateSpan']}
                {this.props.presetData.aggregateType === 'step' ? 's' : 'c'}
                <IconDropDown/>
            </IconButton>
            <Popover
                open={this.state.aggregateOpened}
                anchorEl={()=> document.getElementById('aggregateOpenButton')}
                onClose={()=>{this.setState({aggregateOpened: false})}}
            >
                <div className={this.props.classes.popOver}>
                    <div className={this.props.classes.fieldsContainer}>
                        <IOSelect formData={this.props.presetData} updateValue={this.updateField} name="aggregateType" label="Step type" options={{
                            'count': 'counts',
                            'step': 'seconds',
                        }}/>
                        <IOTextField formData={this.props.presetData} updateValue={this.updateField} name="aggregateSpan"
                            label={this.props.presetData.aggregateType === 'step' ? 'Seconds' : 'Counts'}
                        />
                        <IOObjectField socket={this.props.socket} formData={this.props.presetData} updateValue={this.updateField} name="ticks" label="Use X-ticks from" />
                    </div>
                </div>
            </Popover>
            <RefreshSelect
                className={this.props.classes.refreshSelect}
                minWidth="0px" width="initial"
                formData={this.props.presetData}
                updateValue={this.updateField}
                name="live"
                label=""
                options={liveOptions}
                renderValue={()=>
                    <div className={this.props.classes.refreshSelectButtonTitle}>
                        <IconRefresh/>&nbsp;{I18n.t(liveOptions[this.props.presetData['live']])}
                    </div>
                }
            />
            <div className={this.props.classes.grow1}/>
            <Button variant="contained" color="primary" className={this.props.classes.hintButton} onClick={this.props.createPreset}>
                {I18n.t('Create preset')}
            </Button>
        </Toolbar>;
    }
}

ChartSettings.propTypes = {
    onChange: PropTypes.func,
    presetData: PropTypes.object,
    socket: PropTypes.object,
    instances: PropTypes.array,
    createPreset: PropTypes.func
};

export default withStyles(styles)(ChartSettings)