import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Card, CardContent, OutlinedInput, Icon, TextField, Typography, CardActions, Divider,
    Select, InputLabel, FormControl, MenuItem, LinearProgress, Avatar} from '@material-ui/core';
import {makeStyles, useTheme} from '@material-ui/styles';
import {FuseAnimate, FuseAnimateGroup} from '@fuse';
import {useDispatch, useSelector} from 'react-redux';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import _ from '@lodash';
import {Link} from 'react-router-dom';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

const useStyles = makeStyles(theme => ({
    header    : {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color     : theme.palette.getContrastText(theme.palette.primary.main)
    },
    headerIcon: {
        position     : 'absolute',
        top          : -64,
        left         : 0,
        opacity      : .04,
        fontSize     : 512,
        width        : 512,
        height       : 512,
        pointerEvents: 'none'
    }
}));

function Teams(props)
{
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const categories = [];
    const teams = useSelector(({teamsApp}) => teamsApp.teams.data);

    const classes = useStyles(props);
    const theme = useTheme();
    const [filteredData, setFilteredData] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    useEffect(() => {
        dispatch(Actions.getTeams());
    }, [dispatch]);

    useEffect(() => {
        function getFilteredArray()
        {
            if ( searchText.length === 0)
            {
                return teams;
            }

            return _.filter(teams, item => {
                return item.name.toLowerCase().includes(searchText.toLowerCase())
            });
        }

        if ( teams )
        {
            setFilteredData(getFilteredArray());
        }
    }, [teams, searchText, selectedCategory]);


    function handleSearchText(event)
    {
        setSearchText(event.target.value);
    }

    return (
        <div className="flex flex-col flex-1 w-full">
            <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16 py-24">
                <div className="flex flex-col flex-shrink-0 sm:flex-row items-center justify-between py-24">
                    <TextField
                        label={t('Teams')}
                        placeholder={t('Enter the keyword ...')}
                        className="flex w-full sm:w-320 mb-16 sm:mb-0 mx-16"
                        value={searchText}
                        inputProps={{
                            'aria-label': 'Search'
                        }}
                        onChange={handleSearchText}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <Button component={Link} role="button" to="/apps/teams/new" 
                    // disableelevation 
                    className="flex w-full sm:w-320 mb-16 sm:mb-0 mx-16 whitespace-no-wrap" variant="contained">
                        <span className="hidden sm:flex">{t('Create New Team')}</span>
                        <span className="flex sm:hidden">{t('New Team')}</span>
                    </Button>
                </div>
                {useMemo(() => (
                    filteredData && (
                        filteredData.length > 0 ? (
                                <FuseAnimateGroup
                                    enter={{
                                        animation: "transition.slideUpBigIn"
                                    }}
                                    className="flex flex-wrap py-24"
                                >
                                    {filteredData.map((team) => {
                                        return (
                                            <div className="p-16 w-screen sm:w-screen md:w-1/2 lg:w-1/3" key={team.id}>
                                                <Link to={`/apps/team/${team.id}`}>
                                                    <Card elevation={1} className="flex flex-col h-144"> 
                                                        <div className="flex flex-shrink-0 items-center justify-between px-24 h-64"
                                                        style={{background: team.color, color:theme.palette.getContrastText(team.color)}}>
                                                        <Typography className="text-16 truncate" color="inherit">{team.name}</Typography>
                                                        </div>
                                                        <Divider/>
                                                        <CardContent className="flex flex-row flex-auto">
                                                            {team.userTeam.map(m => {return(<Avatar className="" alt={m.member.firstName} src={m.member.avatar}/>)})}
                                                        </CardContent>
                                                        <CardContent className="flex flex-row flex-auto">
                                                            {team.userTeam.length} {t('Members')}
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </FuseAnimateGroup>
                            ) :
                            (
                                <div className="flex flex-1 items-center justify-center">
                                    <Typography color="textSecondary" className="text-24 my-24">
                                        {t('No teams found')} 😔
                                    </Typography>
                                </div>
                            )
                    )), [filteredData, theme.palette])}
            </div>
        </div>
    );
}

export default withReducer('teamsApp', reducer)(Teams);
