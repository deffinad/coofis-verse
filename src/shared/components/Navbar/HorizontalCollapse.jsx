import React, { useState, useRef } from 'react';
import { Grow, Icon, IconButton, ListItem, ListItemText, Paper, Popover, List } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import HorizontalItem from './HorizontalItem';
import { COLOR, SPACING } from '@/shared/constants/AppConst';

const HorizontalCollapse = ({ item, nestedLevel, dense }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const popoverTimeout = useRef(null);

  const handlePopoverOpen = (event) => {
    clearTimeout(popoverTimeout.current);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    popoverTimeout.current = setTimeout(() => {
      setAnchorEl(null);
    }, 100); // 100ms delay
  };

  const handleChildClick = (url) => {
    setAnchorEl(null);
    navigate(url);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isUrlInChildren = (parent, url) => {
    if (!parent.children) {
      return false;
    }
    for (const child of parent.children) {
      if (child.children && isUrlInChildren(child, url)) {
        return true;
      }
      if (child.url === url || url.startsWith(child.url)) {
        return true;
      }
    }
    return false;
  };

  const IconComponent = Icons[item.icon || 'Article'];
  const open = Boolean(anchorEl);
  const active = isUrlInChildren(item, location.pathname);

  return (
    <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
      <ListItem
        button
        sx={{
          color: active ? COLOR.white_smoke : COLOR.medium_dark_gray,
          backgroundColor: active ? COLOR.sky_blue : COLOR.white_smoke,
          padding: '8px 12px',
          '&.active, &.active:hover, &.active:focus': {
            color: COLOR.white_smoke,
            backgroundColor: COLOR.sky_blue,
          },
          '&.open': {
            backgroundColor: 'rgba(0,0,0,.08)',
          },
          '&:hover': {
            color: active ? COLOR.white_smoke : COLOR.medium_dark_gray,
            backgroundColor: active ? COLOR.sky_blue : COLOR.white_smoke,
          },
          ...(dense && {
            padding: '4px 12px',
          }),
        }}
        className={clsx('navItemSubmenu', open && 'open', active && 'active')}
      >
        {item.icon && (
          <Icon
            sx={{
              color: active ? COLOR.white_smoke : 'action',
              mr: 3.5,
              fontSize: { xs: 16, xl: 16 },
            }}
          >
            <IconComponent sx={{ fontSize: '20px' }} />
          </Icon>
        )}
        <ListItemText className="navLinkTextSubmenu" primary={item.title} />
        <Box p={0}>
          <IconButton disableRipple>
            <KeyboardArrowRightIcon sx={{ fontSize: '18px !important' }} />
          </IconButton>
        </Box>
      </ListItem>
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        PaperProps={{
          onMouseEnter: () => clearTimeout(popoverTimeout.current),
          onMouseLeave: handlePopoverClose,
        }}
      >
        <Grow in={open} style={{ transformOrigin: '0 0 0' }}>
          <Paper>
            {item.children && (
              <List sx={{ px: 0 }}>
                {item.children.map((child) => (
                  <React.Fragment key={child.id}>
                    {child.type === 'collapse' && (
                      <HorizontalCollapse
                        item={child}
                        nestedLevel={nestedLevel + 1}
                      />
                    )}
                    {child.type === 'item' && (
                      <HorizontalItem
                        item={child}
                        nestedLevel={nestedLevel + 1}
                        onClick={handleClose}
                      />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grow>
      </Popover>
    </div>
  );
};

HorizontalCollapse.propTypes = {
  item: PropTypes.object.isRequired,
  nestedLevel: PropTypes.number,
  dense: PropTypes.bool,
};

HorizontalCollapse.defaultProps = {
  nestedLevel: 0,
};

export default React.memo(HorizontalCollapse);