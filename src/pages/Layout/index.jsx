import React, { useEffect, useRef, useState } from 'react'
import { FONTS, SPACING } from '@/shared/AppConst'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import Card from 'remoteApp/Card'
import { Add, DragIndicator, MoreVert } from '@mui/icons-material'
import { DndContext } from '@dnd-kit/core'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import { dataComponents } from '@/json/DocsComponent'
import DraggableComponent from '@/DraggableComponent'
import DroppableGrid from '@/DroppableGrid'
import { createSwapy } from 'swapy'
import { Components } from "remoteApp/Components";

const WIDTH_DRAWER = 250
const HEIGHT_NAVBAR = 64

const Layout = () => {
    const [pages, setPages] = useState([]);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const containerRefs = useRef({});
    const gridRef = useRef(null);
    const [atribut, setAtribute] = useState();
    const [formData, setFormData] = useState(atribut);
    const [newSize, setNewSize] = useState();
    const [currentPage, setCurrentPage] = useState(null);
    const [temp, setTemp] = useState();
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setShow(false); // scrolling down
            } else {
                setShow(true); // scrolling up
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // get json from local storage
    useEffect(() => {
        const savedPages = localStorage.getItem("savedPages");
        const currentpages = localStorage.getItem("curentPages");
        if (savedPages) {
            setPages(JSON.parse(savedPages));
            console.log(JSON.parse(savedPages))
            setCurrentPage(JSON.parse(currentpages));
        }
    }, []);

    // save json to local storage
    useEffect(() => {
        localStorage.setItem("savedPages", JSON.stringify(pages));
        localStorage.setItem("curentPages", JSON.stringify(currentPage));
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
                setTemp(event);
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

    // add page
    const addPage = () => {
        const newPage = {
            id: `pages${pages.length + 1}`,
            name: `Page ${pages.length + 1}`,
            layouts: [],
        };
        setPages([...pages, newPage]);
        setCurrentPage(newPage.id);
    };

    // add layout inside page
    const addLayout = () => {
        const currentPageIndex = pages.findIndex((p) => p.id === currentPage);
        if (currentPageIndex === -1) return;

        const newLayout = {
            id: generateId(),
            name: "Layout",
            size: 12,
            height: 100,
        };
        const tempPages = pages.map((page, idx) =>
            idx === currentPageIndex
                ? { ...page, layouts: [...page.layouts, newLayout] }
                : page
        )
        console.log(tempPages)
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

    // delete layout
    const deleteLayout = () => {
        if (!selectedLayout || !currentPage) return;

        setPages((prevPages) =>
            prevPages.map((page) =>
                page.id === currentPage
                    ? {
                        ...page,
                        layouts: page.layouts.filter(
                            (layout) => layout.id !== selectedLayout
                        ),
                    }
                    : page
            )
        );
        setSelectedLayout(null);
    };

    const updateComponentSize = (componentId, newSize, newHeight) => {
        setPages((prevPages) =>
            prevPages.map((page) => ({
                ...page,
                layouts: page.layouts.map((layout) => ({
                    ...layout,
                    children: updateSizeRecursively(
                        layout.children,
                        componentId,
                        newSize,
                        newHeight
                    ),
                })),
            }))
        );
    };

    const updateSizeRecursively = (components, gridId, newSize, newHeight) => {
        return components.map((comp) => {
            const updatedComp =
                comp.id === gridId ? { ...comp, size: newSize } : comp;

            if (updatedComp.type === "grid") {
                return {
                    ...updatedComp,
                    children: updatedComp.children.map((child) =>
                        child.id === atribut?.id ? { ...child, height: newHeight } : child
                    ),
                };
            }

            return updatedComp;
        });
    };

    const saveOrder = (layoutIndex) => {
        const updatedPages = pages.map((page) => {
            if (!page.layouts[layoutIndex]) return page;

            return {
                ...page,
                layouts: page.layouts.map((layout, index) => {
                    if (index !== layoutIndex) return { ...layout };

                    const childrenCopy = JSON.parse(JSON.stringify(layout.children));

                    const childrenMap = Object.fromEntries(
                        childrenCopy.map((component) => [
                            component.id,
                            { children: component.children, size: component.size },
                        ])
                    );

                    const updatedChildren = childrenCopy.map((component) => {
                        const slotItem = temp?.newSlotItemMap?.asArray.find(
                            (slot) => slot.slot === component.id
                        );

                        if (!slotItem) return component;

                        return {
                            ...component,
                            id: slotItem.item,
                            children: childrenMap[slotItem.item]?.children || [],
                        };
                    });

                    return { ...layout, children: updatedChildren };
                }),
            };
        });

        localStorage.removeItem("savedPages");
        localStorage.setItem("savedPages", JSON.stringify(updatedPages));
        window.location.reload();
    };

    const handleDragEnd = (event) => {
        const { over, active } = event;
        if (over) {
            const gridId = over.id;

            const componentType = active?.id || "Unknown";

            const componentAttributes = {
                Navbar: {
                    id: `navbar-${Date.now()}`,
                    type: "Navbar",
                    menuItems: [
                        { label: "Home", path: "/" },
                        { label: "About", path: "/about" },
                        { label: "Contact", path: "/contact" },
                    ],
                    height: 65,
                },
                Ratings: { id: `ratings-${Date.now()}`, type: "Ratings", score: 5 },
                Input: {
                    id: `input-${Date.now()}`,
                    type: "Input",
                    name: "userInput",
                    label: "Your Name",
                    value: "",
                    placeholder: "Enter your name",
                    tipe: "text",
                },
                ArsipCuti: {
                    id: `arsipcuti-${Date.now()}`,
                    type: "ArsipCuti",
                },
                KuotaCutiSaatIni: {
                    id: `kuotacutisaatini-${Date.now()}`,
                    config1: KuotaCuti1,
                    config2: KuotaCuti2,
                    type: "KuotaCutiSaatIni",
                },
                ListDate: {
                    id: `listdate-${Date.now()}`,
                    config: DateData,
                    type: "ListDate",
                },
                MonitoringKuota: {
                    id: `monitoringkuota-${Date.now()}`,
                    config: DataKuota,
                    type: "MonitoringKuota",
                },
                StatusDokumenCutiDashboard: {
                    id: `statusdokumencutidashboard-${Date.now()}`,
                    config: DataCuti,
                    type: "StatusDokumenCutiDashboard",
                },
            };

            const newComponent = componentAttributes[componentType] || {
                id: `unknown-${Date.now()}`,
                type: "Unknown",
            };

            console.log(newComponent);

            setPages((prevPages) =>
                prevPages.map((page) => ({
                    ...page,
                    layouts: page.layouts.map((layout) => ({
                        ...layout,
                        children: layout.children.map((grid) =>
                            grid.id === gridId
                                ? {
                                    ...grid,
                                    children: [
                                        ...(Array.isArray(grid.children) ? grid.children : []),
                                        newComponent,
                                    ],
                                }
                                : grid
                        ),
                    })),
                }))
            );
        }
    };

    const renderComponents = (components, layoutId, layoutidx) => {
        return (
            components.map((comp) => {
                return (
                    <Grid
                        ref={gridRef}
                        item
                        xs={comp.size}
                        key={comp.id}
                        data-swapy-slot={comp.type === "grid" ? `${comp.id}` : undefined}
                    >
                        <DroppableGrid
                            key={comp.id}
                            id={comp.id}
                            onClick={() => {
                                setSelectedLayout(layoutId);
                                setNewSize(comp.size);
                                setAtribute(comp.children[0]);
                            }}
                        // selectedGrid={selectedGrid}
                        >
                            {comp.children && comp.children.length > 0 ? (
                                comp.children.map((child) =>
                                    React.createElement(Components?.[child.type], {
                                        key: child.id,
                                        ...child,
                                    })
                                )
                            ) : (
                                <p style={{ color: "gray" }}>Empty Grid</p>
                            )}
                        </DroppableGrid>
                    </Grid>
                )
            })
        )
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
                    <DraggableComponent key={item.id} id={item.componentName}>
                        <TreeItem itemId={item.id} label={renderLabel(item)}>
                            {item.children && renderTreeItemComponent(item.children)}
                        </TreeItem>
                    </DraggableComponent>
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

                        setSelectedLayout("");
                        setCurrentPage(item.id);
                    }}
                />
            ))
        )
    }

    const generateId = () => {
        const randomId = Math.random().toString(36).substring(2, 10)

        return randomId
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {/* Navbar */}
            <Stack sx={styleNavbar}>
                <p>Deffin</p>
            </Stack>

            <Stack direction="row" sx={{ minHeight: '100vh', position: 'relative', bgcolor: grey[100] }}>
                <Card sx={{ ...styleDrawer, left: SPACING * 8, overflowX: 'hidden', overflowY: 'auto' }}>
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
                                <TreeItem sx={styleTreeItem} itemId="grid" label="Data Grid">
                                    <TreeItem sx={styleTreeItem} itemId="grid-community" label="@mui/x-data-grid" />
                                    <TreeItem sx={styleTreeItem} itemId="grid-pro" label="@mui/x-data-grid-pro" />
                                    <TreeItem sx={styleTreeItem} itemId="grid-premium" label="@mui/x-data-grid-premium" />
                                </TreeItem>
                                <TreeItem sx={styleTreeItem} itemId="pickers" label="Date and Time Pickers">
                                    <TreeItem sx={styleTreeItem} itemId="pickers-community" label="@mui/x-date-pickers" />
                                    <TreeItem sx={styleTreeItem} itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
                                </TreeItem>
                                <TreeItem sx={styleTreeItem} itemId="charts" label="Charts">
                                    <TreeItem sx={styleTreeItem} itemId="charts-community" label="@mui/x-charts" />
                                </TreeItem>
                                <TreeItem sx={styleTreeItem} itemId="tree-view" label="Tree View">
                                    <TreeItem sx={styleTreeItem} itemId="tree-view-community" label="@mui/x-tree-view" />
                                </TreeItem>
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

                <Card sx={{ ...styleMainContent, padding: 0 }}>
                    <Card bgColor={grey[900]} sx={{ color: 'white' }}>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Typography fontWeight={FONTS.SEMI_BOLD}>{pages.find((page) => page.id === currentPage)?.name}</Typography>
                        </Stack>
                    </Card>

                    <Stack padding={SPACING}>
                        {currentPage && (
                            <>
                                {/* show layout */}
                                {pages
                                    .find((page, pageidx) => page.id === currentPage)
                                    ?.layouts.map((layout, layoutidx) => (
                                        <Box
                                            ref={(el) => (containerRefs.current[layout.id] = el)}
                                            key={layout.id}
                                            sx={{
                                                border:
                                                    selectedLayout === layout.id ? "1px solid green" : "",
                                                borderRadius: "10px",
                                                padding: 1,
                                                marginBottom: 2,
                                                minHeight: "100px",
                                                boxShadow:
                                                    selectedLayout === layout.id
                                                        ? "0px 4px 10px rgba(0, 128, 0, 0.5)"
                                                        : "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                            }}
                                            onClick={() => {
                                                setSelectedLayout(layout.id);
                                                setAtribute(null);
                                            }}
                                        >
                                            <Grid container spacing={2}>
                                                {/* {renderComponents(layout.children, layout.id, layoutidx)} */}
                                            </Grid>
                                        </Box>
                                    ))}
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
                    </Stack>
                </Card>

                <Card
                    sx={{
                        position: 'fixed',
                        backgroundColor: grey[900],
                        bottom: 10,
                        left: `calc(${WIDTH_DRAWER + SPACING * 8 * 2}px + ((100vw - ${(WIDTH_DRAWER + SPACING * 8 * 2) * 2}px) / 2) - 50px)`,
                        color: 'white',
                        paddingY: 1.5,
                        paddingX: SPACING,
                        transition: '0.5s ease-in-out',
                        transform: show ? 'translateY(0)' : 'translateY(200%)',
                    }}
                >
                    <Stack alignItems={'center'} justifyContent={'center'} onClick={addLayout}>
                        <Card sx={{ backgroundColor: 'white', color: 'black', paddingX: SPACING * 2, paddingY: 0.5 }}>
                            <Typography sx={{ fontSize: 14 }}>Add Layout</Typography>
                        </Card>
                    </Stack>
                </Card>
            </Stack>
        </DndContext>
    )
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
    padding: 1
}

const styleMainContent = {
    flexGrow: 1,
    marginLeft: `${WIDTH_DRAWER + ((SPACING * 8 * 2))}px`,
    marginRight: `${WIDTH_DRAWER + ((SPACING * 8 * 2))}px`,
    backgroundColor: 'white',
    minHeight: '100vh',
    marginTop: `calc(${HEIGHT_NAVBAR + SPACING * 8}px)`,
    marginBottom: SPACING,
    borderRadius: SPACING,
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