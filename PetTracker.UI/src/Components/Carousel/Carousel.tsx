import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Slide from "@mui/material/Slide";
import { Fade } from '@mui/material';
import Stack from "@mui/material/Stack";

export default function Carousel({ cards }) {
    const [currentPage, setCurrentPage] = useState(0);

    const cardsPerPage = 1;

    // these two functions handle changing the pages
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };


    // this sets the container width to the number of cards per page * 250px
    // which we know because it is defined in the card component
    const containerWidth = cardsPerPage * 250; // 250px per card

    return (
        //  outer box that holds the carousel and the buttons
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                height: "200px",
                width: "100%",
                marginTop: "0px",
            }}
        >
            <IconButton
                onClick={handlePrevPage}
                sx={{ margin: 5 }}
                disabled={currentPage === 0}
                className="btn-carousel"
            >
                {/* this is the button that will go to the previous page you can change these icons to whatever you wish*/}
            <NavigateBeforeIcon />
            </IconButton>
            <Box sx={{ width: `${containerWidth}px`, height: "100%" }}>
                {cards?.map((card, index) => (
                    <Box
                        key={`card-${index}`}
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: currentPage === index ? "block" : "none",
                        }}
                    >
                        {/* this is the slide animation that will be used to slide the cards in and out*/}
                        <Fade in={currentPage === index}>
                            <Stack
                                spacing={2}
                                direction="row"
                                alignContent="center"
                                justifyContent="center"
                                sx={{ width: "100%", height: "100%" }}
                            >
                                {cards?.slice(
                                    index * cardsPerPage,
                                    index * cardsPerPage + cardsPerPage
                                )}
                            </Stack>
                        </Fade>
                    </Box>
                ))}
            </Box>
            <IconButton
                onClick={handleNextPage}
                sx={{
                    margin: 5,
                }}
                disabled={
                    currentPage >= Math.ceil((cards?.length || 0) / cardsPerPage) - 1
                }
                className="btn-carousel"
            >
                <NavigateNextIcon />
            </IconButton>
        </Box>
    );
}

