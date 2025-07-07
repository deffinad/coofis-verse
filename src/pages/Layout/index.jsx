/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { FONTS, SPACING } from '@/shared/AppConst'
import { Box, Divider, Grid, IconButton, Input, Stack, Tooltip, Typography } from '@mui/material'
import { grey, red } from '@mui/material/colors'
import Card from 'remoteApp/Card'
import { Add, DeleteOutline, DragIndicator, MoreVert, Save } from '@mui/icons-material'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import { dataComponents } from '@/json/DocsComponent'
import DraggableComponent from '@/DraggableComponent'
import { createSwapy } from 'swapy'
import { Components } from "remoteApp/Components";
import PropTypes from 'prop-types'
import Droppable from '@/shared/components/Droppable'
import Draggable from '@/shared/components/Draggable'

const WIDTH_DRAWER = 250
const HEIGHT_NAVBAR = 64

const Layout = () => {
    const containerRefs = useRef({});
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [activeDragItem, setActiveDragItem] = useState(null)

    // add page
    const addPage = () => {
        const newLayout = {
            id: generateId(),
            name: "Container",
            properties: {
                size: 12,
                height: '100%'
            },
            children: [],
        };

        const newPage = {
            id: `pages${pages.length + 1}`,
            name: `Page ${pages.length + 1}`,
            layouts: [newLayout],
        };
        setPages([...pages, newPage]);
        setCurrentPage(newPage.id);
    };

    const pushLayoutById = (data, id, newLayout) => {
        for (const item of data) {
            if (item.id === id) {
                item.children = item.children || [];
                item.children.push(newLayout);
                return true;
            }

            if (item.children && item.children.length > 0) {
                const added = pushLayoutById(item.children, id, newLayout);
                if (added) return true;
            }
        }

        return false;
    };

    // add layout inside page
    const addLayout = () => {
        const currentPageIndex = pages.findIndex((p) => p.id === currentPage);
        if (currentPageIndex === -1) return;

        const newLayout = {
            id: generateId(),
            children: [],
        };

        let tempPages = [...pages]
        let tempLayout = tempPages[currentPageIndex]
        if (selectedLayout !== null) {
            newLayout['name'] = 'Layout'
            newLayout['properties'] = {
                size: 12,
                height: '300px'
            }
            pushLayoutById(tempLayout?.layouts, selectedLayout?.id, newLayout);
        } else {
            newLayout['name'] = 'Container'
            newLayout['properties'] = {
                size: 12,
                height: '100%'
            }
            tempLayout?.layouts.push(newLayout)
        }
        setPages(tempPages);
    };

    // delete page
    const deletePage = () => {
        if (!currentPage) return;
        const updatedPages = pages.filter((page) => page.id !== currentPage);
        setPages(updatedPages);

        // Set halaman aktif ke halaman pertama setelah dihapus
        if (updatedPages.length > 0) {
            setCurrentPage(updatedPages[0].id);
        } else {
            setCurrentPage(null);
        }
    };

    const removeLayoutById = (layouts, targetId) => {
        return layouts
            .map(layout => {
                if (layout.id === targetId) {
                    return null;
                }

                if (layout.children && layout.children.length > 0) {
                    layout.children = removeLayoutById(layout.children, targetId);
                }

                return layout;
            })
            .filter(Boolean);
    };

    // delete layout
    const deleteLayout = () => {
        const currentPageIndex = pages.findIndex((p) => p.id === currentPage);
        if (currentPageIndex === -1) return;

        let tempPages = [...pages]
        let tempLayout = tempPages[currentPageIndex]

        tempLayout.layouts = removeLayoutById(tempLayout.layouts, selectedLayout?.id);
        setPages(tempPages)
        setSelectedLayout(null);
    };

    const handleDragStart = (event) => {
        const { active } = event;
        const draggedItem = dataComponents[1].children.find(item => item.componentName === active.id);
        setActiveDragItem(draggedItem);
    };

    const handleDragEnd = (event) => {
        const { over, active } = event;
        if (over) {
            const currentPageIndex = pages.findIndex((p) => p.id === currentPage);
            if (currentPageIndex === -1) return;

            const newLayout = {
                id: 'component' + generateId(),
                name: active.id
            };

            let tempPages = [...pages]
            let tempLayout = tempPages[currentPageIndex]
            pushLayoutById(tempLayout?.layouts, over.id, newLayout);
            setPages(tempPages);
        }
    };

    const handleDragCancel = () => {
        setActiveDragItem(null)
    }

    const generateId = () => {
        const randomId = Math.random().toString(36).substring(2, 10)

        return randomId
    }

    // get json from local storage
    useEffect(() => {
        const savedPages = localStorage.getItem("savedPages");
        const currentpages = localStorage.getItem("curentPages");
        if (savedPages) {
            setPages(JSON.parse(savedPages));
            setCurrentPage(JSON.parse(currentpages));
        }
    }, []);

    // save json to local storage
    useEffect(() => {
        console.log(pages)
        // localStorage.setItem("savedPages", JSON.stringify(pages));
        // localStorage.setItem("curentPages", JSON.stringify(currentPage));
    }, [pages, currentPage]);

    // create swapy
    useEffect(() => {
        if (!currentPage) return;

        const activePage = pages.find((p) => p.id === currentPage);
        if (!activePage) return;

        activePage.layouts.forEach((layout) => {
            if (!containerRefs.current[layout.id]) return;

            if (containerRefs.current[layout.id].swapy?.destroy) {
                containerRefs.current[layout.id].swapy.destroy();
            }

            containerRefs.current[layout.id].swapy = createSwapy(
                containerRefs.current[layout.id]
            );

            containerRefs.current[layout.id].swapy.onSwap((event) => {
                console.log(`Swapped in ${layout.id}:`, event);
            });
        });

        return () => {
            activePage.layouts.forEach((layout) => {
                if (containerRefs.current[layout.id]?.swapy?.destroy) {
                    containerRefs.current[layout.id].swapy.destroy();
                }
            });
        };
    }, [currentPage, pages]);

    const renderTreeItemComponent = (data) => {
        const renderLabel = (item) => {
            return (
                <Stack direction={'row'} spacing={SPACING} alignItems={'center'} justifyContent={'space-between'}>
                    <Stack>
                        <Typography>{item.label}</Typography>
                    </Stack>
                    {!item.children && (
                        <Stack>
                            <DragIndicator sx={{ fontSize: '18px' }} />
                        </Stack>
                    )}
                </Stack>
            )
        }
        return (
            data.map(item => (
                item.draggable ? (
                    <Draggable key={item.id} id={item.componentName}>
                        <TreeItem itemId={item.id} label={renderLabel(item)}>
                            {item.children && renderTreeItemComponent(item.children)}
                        </TreeItem>
                    </Draggable>
                ) : (
                    <TreeItem key={item.id} itemId={item.id} label={renderLabel(item)} sx={styleTreeItem}>
                        {item.children && renderTreeItemComponent(item.children)}
                    </TreeItem>
                )
            ))
        )
    }

    const renderTreeItemPages = (data) => {
        return (
            data.map(item => (
                <TreeItem
                    key={item.id}
                    itemId={item.id}
                    label={item.name}
                    sx={styleTreeItem}
                    onClick={() => {
                        Object.values(containerRefs.current).forEach((ref) => {
                            if (ref?.swapy?.destroy) {
                                ref.swapy.destroy();
                            }
                        });

                        containerRefs.current = {};

                        setSelectedLayout(null);
                        setCurrentPage(item.id);
                    }}
                />
            ))
        )
    }

    const renderTreeItemLayers = (data) => {
        const renderLabel = (item) => {
            return (
                <Stack direction={'row'} spacing={SPACING} alignItems={'center'} justifyContent={'space-between'}>
                    <Stack>
                        <Typography>{item.name}</Typography>
                    </Stack>
                    {/* {!item.children && (
                        <Stack>
                            <DragIndicator sx={{ fontSize: '18px' }} />
                        </Stack>
                    )} */}
                </Stack>
            )
        }
        return (
            data.map(item => (
                <TreeItem key={item.id} itemId={item.id} label={renderLabel(item)} sx={styleTreeItem} onClick={() => setSelectedLayout(item)}>
                    {(item.children && item.children.length !== 0) && renderTreeItemLayers(item.children)}
                </TreeItem>
            ))
        )
    }

    const renderLayout = (data) => {
        return data.map((layout, index) => (
            <Grid
                key={layout.id}
                size={{ xs: layout.properties ? parseInt(layout.properties.size) : 12 }}
                sx={{ position: 'relative' }}
                minHeight={layout.properties ? layout.properties.height : 'auto'}
            >
                {layout.id.includes('component') ? (
                    React.createElement(Components?.[layout.name], {
                        key: layout.id,
                    })
                ) : (
                    <Droppable
                        key={layout.id}
                        id={layout.id}
                        selectedLayout={selectedLayout}
                        onClick={() => setSelectedLayout(layout)}
                    >
                        {layout.children && layout.children.length > 0 &&
                            <Grid container spacing={SPACING} margin={SPACING}>
                                {renderLayout(layout.children)}
                            </Grid>
                        }

                        {layout.id === selectedLayout?.id && (
                            <>
                                {/* Delete Layout Button */}
                                <Stack
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Tooltip placement='bottom' title='Delete layout'>
                                        <IconButton onClick={deleteLayout}>
                                            <DeleteOutline sx={{ '&:hover': { color: red[900] } }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>

                                {/* Add Grid Button */}
                                {/* <Stack
                                alignItems={'center'}
                                justifyContent={'center'}
                                sx={{
                                    position: 'absolute',
                                }}
                            >
                                <Stack alignItems={'center'} justifyContent={'center'} onClick={addLayout} sx={{ border: '1px solid black', borderRadius: '10px', cursor: 'pointer' }}>
                                    <Card sx={{ backgroundColor: 'white', color: 'black', paddingX: SPACING * 2, paddingY: 0.5 }}>
                                        <Typography sx={{ fontSize: 14 }}>Add Layout (Item)</Typography>
                                    </Card>
                                </Stack>
                            </Stack> */}
                            </>
                        )}
                    </Droppable>
                )}
            </Grid>
        ))
    }

    const handleChangeProperties = (name, value) => {
        const currentPageIndex = pages.findIndex((p) => p.id === currentPage);
        if (currentPageIndex === -1) return;

        const editPropertiesById = (data, id) => {
            for (const item of data) {
                if (item.id === id) {
                    item.properties[name] = value
                    return true;
                }

                if (item.children && item.children.length > 0) {
                    const added = editPropertiesById(item.children, id);
                    if (added) return true;
                }
            }
            return false;
        };

        let tempPages = [...pages]
        let tempLayout = tempPages[currentPageIndex]
        editPropertiesById(tempLayout?.layouts, selectedLayout?.id);
        setPages(tempPages)
    }

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            {/* Navbar */}
            <Stack sx={styleNavbar}>
                <p>Deffin</p>
            </Stack>

            <Stack direction="row" sx={{ minHeight: '100vh', position: 'relative', bgcolor: grey[100] }}>
                <Card sx={{ ...styleDrawer, left: SPACING * 8 }}>
                    <Stack spacing={SPACING}>
                        <Stack spacing={SPACING / 2}>
                            <Card bgColor={grey[900]} sx={{ color: 'white', paddingY: 1 }}>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Stack>
                                        <Typography fontWeight={FONTS.SEMI_BOLD}>Pages</Typography>
                                        <Typography>Description</Typography>
                                    </Stack>

                                    <Stack>
                                        <Add sx={{ cursor: 'pointer' }} onClick={addPage} />
                                    </Stack>
                                </Stack>
                            </Card>

                            <SimpleTreeView
                                slots={{
                                    endIcon: () => <MoreVert />
                                }}
                            >
                                {renderTreeItemPages(pages)}
                            </SimpleTreeView>
                        </Stack>

                        <Divider />

                        {/* Layers */}
                        <Stack spacing={SPACING / 2}>
                            <Card bgColor={grey[900]} sx={{ color: 'white', paddingY: 1 }}>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Typography fontWeight={FONTS.SEMI_BOLD}>Layers</Typography>
                                </Stack>
                            </Card>

                            <SimpleTreeView>
                                {renderTreeItemLayers(pages.find(page => page.id === currentPage)?.layouts ?? [])}
                            </SimpleTreeView>
                        </Stack>

                        <Divider />

                        {/* Components */}
                        <Stack spacing={SPACING / 2}>
                            <Card bgColor={grey[900]} sx={{ color: 'white', paddingY: 1 }}>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Typography fontWeight={FONTS.SEMI_BOLD}>Components</Typography>
                                </Stack>
                            </Card>

                            <SimpleTreeView>
                                {renderTreeItemComponent(dataComponents)}
                            </SimpleTreeView>
                        </Stack>
                    </Stack>
                </Card>

                <Card sx={{ ...styleMainContent }}>
                    <Card bgColor={grey[900]} sx={{ color: 'white' }}>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Stack>
                                <Typography fontWeight={FONTS.SEMI_BOLD}>{pages.find((page) => page.id === currentPage)?.name}</Typography>
                            </Stack>

                            <Stack direction={'row'} alignItems={'center'} spacing={SPACING / 2}>
                                <Stack>
                                    <Add onClick={addLayout} />
                                </Stack>
                                <Stack>
                                    <Save />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Card>

                    <Stack id="wrapperLayout" height={'100%'}>
                        {currentPage && (
                            <>
                                {
                                    pages.find((page) => page.id === currentPage)?.layouts.length === 0 ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                border: "1px dashed green",
                                                borderRadius: "10px",
                                                height: '100%',
                                                cursor: 'pointer',
                                            }}
                                            onClick={addLayout}
                                        >
                                            <Stack alignItems={'center'} justifyContent={'center'}>
                                                <Typography color={'gray'}>No Layouts</Typography>
                                            </Stack>
                                            <Stack alignItems={'center'} justifyContent={'center'}>
                                                <Typography color={'gray'}>Click To Add Layout</Typography>
                                            </Stack>
                                        </Box>
                                    ) : (
                                        <>
                                            {/* show layout */}
                                            <Grid container sx={{ height: '100%' }}>
                                                {renderLayout(pages.find(page => page.id === currentPage)?.layouts)}
                                            </Grid>
                                        </>
                                    )
                                }
                            </>
                        )}
                    </Stack>
                </Card>

                <Card sx={{ ...styleDrawer, right: SPACING * 8 }}>
                    <Stack spacing={SPACING}>
                        <Card bgColor={grey[900]} sx={{ color: 'white', paddingY: 1 }}>
                            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Stack>
                                    <Typography fontWeight={FONTS.SEMI_BOLD}>Properties</Typography>
                                </Stack>
                            </Stack>
                        </Card>

                        <Stack>
                            {
                                selectedLayout !== null &&
                                Object.keys(selectedLayout.properties).map((item, index) => (
                                    <Stack key={index} spacing={1}>
                                        <Typography textTransform={'capitalize'}>{item}</Typography>
                                        <Input value={selectedLayout.properties[item]} onChange={(e) => handleChangeProperties(item, e.target.value)} />
                                    </Stack>
                                ))
                            }
                        </Stack>
                    </Stack>
                </Card>
            </Stack>

            <DragOverlay dropAnimation={null}>
                {activeDragItem ? <TreeItemPreview item={activeDragItem} /> : null}
            </DragOverlay>
        </DndContext>
    )
}

const TreeItemPreview = ({ item }) => (
    <Stack
        sx={{
            padding: 1,
            border: '1px solid #ccc',
            backgroundColor: 'white',
        }}
    >
        <Typography>{item.label}</Typography>
    </Stack>
);

TreeItemPreview.propTypes = {
    item: PropTypes.any
}

const styleTreeItem = {
    '& .MuiTreeItem-content': {
        paddingY: `${SPACING * 4}px !important`
    }
}

const styleDrawer = {
    position: 'fixed',
    width: WIDTH_DRAWER,
    backgroundColor: 'white',
    height: `calc(100vh - ${HEIGHT_NAVBAR + (SPACING * 8 * 2)}px)`,
    top: `calc(50% + ${HEIGHT_NAVBAR / 2}px)`,
    transform: 'translateY(-50%)',
    borderRadius: SPACING,
    boxSizing: 'border-box',
    padding: 1,
    zIndex: 10,
    overflowX: 'hidden',
    overflowY: 'auto'
}

const styleMainContent = {
    flexGrow: 1,
    marginLeft: `${WIDTH_DRAWER + ((SPACING * 8 * 2))}px`,
    marginRight: `${WIDTH_DRAWER + ((SPACING * 8 * 2))}px`,
    backgroundColor: 'transparent',
    minHeight: '80vh',
    marginTop: `calc(${HEIGHT_NAVBAR + SPACING * 8}px)`,
    marginBottom: SPACING,
    borderRadius: SPACING,
    padding: 0,
    gap: SPACING
}

const styleNavbar = {
    width: '100%',
    height: HEIGHT_NAVBAR,
    position: 'fixed',
    zIndex: 9,
    backgroundColor: 'white',
    borderBottom: `1px solid ${grey[200]}`,
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
}

export default Layout