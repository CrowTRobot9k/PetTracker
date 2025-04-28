import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";

export default function Carousel({ slides }: React.ReactElement[]) {

    const [cards, setCards] = useState<React.ReactElement[]>([]);
    useEffect(() => {
        setCards([]);
        setCards(slides);
        // eslint-disable-next-line
    }, []);
    // currentPage is the current page of the cards that is currently displayed
    const [currentPage, setCurrentPage] = useState(0);
    // slideDirection is the direction that the cards will slide in
    const [slideDirection, setSlideDirection] = useState<
        "right" | "left" | undefined
    >("left");

    const cardsPerPage = 1;

    // these two functions handle changing the pages
    const handleNextPage = () => {
        setSlideDirection("left");
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setSlideDirection("right");
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
            >
                {/* this is the button that will go to the previous page you can change these icons to whatever you wish*/}
                <NavigateBeforeIcon />
            </IconButton>
            <Box sx={{ width: `${containerWidth}px`, height: "100%" }}>
                {/* this is the box that holds the cards and the slide animation,
        in this implementation the card is already constructed but in later versions you will see how the
        items you wish to use will be dynamically created with the map method*/}
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
                        <Slide direction={slideDirection} in={currentPage === index}>
                            <Stack
                                spacing={2}
                                direction="row"
                                alignContent="center"
                                justifyContent="center"
                                sx={{ width: "100%", height: "100%" }}
                            >
                                {/* this slices the cards array to only display the amount you have previously determined per page*/}
                                {cards?.slice(
                                    index * cardsPerPage,
                                    index * cardsPerPage + cardsPerPage
                                )}
                            </Stack>
                        </Slide>
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
            >
                <NavigateNextIcon />
            </IconButton>
        </Box>
    );
}

