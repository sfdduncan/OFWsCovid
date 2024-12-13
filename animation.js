// Set the width and height of the visualization
var WIDTH = window.innerWidth / 2; // Half of the window width
var HEIGHT = window.innerHeight; // Full window height

// Create a translation string to center elements in the SVG
var translate = 'translate(' + (WIDTH / 2) + ',' + (HEIGHT / 2) + ')';

// Create an SVG element inside the #sticky element
var svg = d3.select("#sticky").append("svg")
    .attr('width', WIDTH + 50)
    .attr('height', HEIGHT)
    .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
    .attr("preserveAspectRatio", "xMidYMid meet"); // Ensures content scales and centers
    

// Reference to the #currentScrollTop element to update scrolling status
var currentScrollTop = d3.select('#currentScrollTop');

// Initialize the current panel
var panel = 0;

// Define grid dimensions, column count, and padding
var grid = 10;
var columns = 50; // 50 dots per row for a compact layout
var mt = window.innerWidth / 24; // Margin-top value
var ml = window.innerHeight / 3; // Margin-left value

// Function to shuffle an array randomly
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Function to generate and display dots
function setup(totalDots) {
    console.log(`Setting up dots with ${totalDots} dots`);

    var dotData = Array.from({ length: totalDots }, (_, i) => ({ id: i }));

    //flower path svg 
    
    svg.selectAll(".dot").remove(); // Clear previous dots
    svg.selectAll(".dots-label").remove();

    svg.append("text")
    .attr("class", "dots-label")
    .attr("x", mt - 5) // Adjust the x-position relative to your margin
    .attr("y", ml - 110) // Adjust the y-position slightly above the dots
    .text("1 dot = 1,000 people")
    .attr("font-weight", "bold")
    .attr("font-size", "16px") // Adjust text size
    .attr("fill", "black") // Text color
    .attr("text-anchor", "start"); // Align text to the start (left-aligned)

    svg.selectAll(".dot")
        .data(dotData)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => (i % columns) * grid)
        .attr("cy", (d, i) => Math.floor(i / columns) * grid - 100)
        .attr("r", grid / 3)
        .attr("class", "dot")
        .attr("transform", `translate(${mt},${ml})`)
        .attr("fill", "white") // Initial fill color: white
        .attr("stroke", "black") // Black outline
        .attr("stroke-width", 1) // Outline thickness
        .attr("opacity", 1); // Fully visible initiall
}

// Function to start animations
function start(totalDots) {
    console.log(`Starting animation with ${totalDots} dots`);

    d3.selectAll(".dot")
        .transition()
        .duration(1000) // Smooth transition
        .attr("opacity", 1);
}

// Function to transition dots in the second section
function transitionToSecondSection() {
    console.log("Transitioning to the second section...");
    var totalDots = 2200
    // Select the last 420 dots 
    d3.selectAll(".dot")
        .filter((d, i) => i >= totalDots - 420) // Last 420 dots
        .transition()
        .duration(1000) // Smooth transition
        .attr("fill", "#5A8C0F") // Change fill color to red
        .attr("fill-opacity", 0.3) // Slight transparency
        .attr("stroke", "black")
        .transition() // Second transition: Fall off the page
        .delay(() => Math.random() * 1000) // Random delay between 0 and 1 second
        .duration(1000) // 1 second duration for the fall
        .attr("cy", () => HEIGHT + Math.random() * 100) // Fall to a random position below the page
        .attr("opacity", 0); // Fade out during the fall
}


function highlightGenderDistribution() {
    console.log("Highlighting gender distribution...");

    // Gender distribution numbers
    var maleCount = 720;
    var femaleCount = 1060;


    svg.selectAll(".gender-label").remove();

    // Add text label for Male
    svg.append("text")
        .attr("class", "gender-label")
        .attr("x", mt - 8) // Adjust the x-position for Male text
        .attr("y", ml - 35) // Adjust the y-position near Male dots
        .text(`Male: ${maleCount}`)
        .attr("font-size", "10px") // Adjust text size
        .attr("fill", "black") // Match Male dot color
        .attr("text-anchor", "end"); // Align text to the right (near the dots)

    // Add text label for Female
    svg.append("text")
        .attr("class", "gender-label")
        .attr("x", mt - 8) // Adjust the x-position for Female text
        .attr("y", ml + 150) // Adjust the y-position near Female dots
        .text(`Female: ${femaleCount}`)
        .attr("font-size", "10px") // Adjust text size
        .attr("fill", "black") // Match Female dot color
        .attr("text-anchor", "end"); // Align text to the right (near the dots)

    // Select the first 720 dots (Male)
    // Transform male dots
    d3.selectAll(".dot")
        .filter((d, i) => i < maleCount) // First 720 dots are Male
        .transition() // First transition: Change color
        .duration(1000)
        .attr("fill", "#497309") // Set color to slight orange for Male
        .attr("fill-opacity", 0.4) // Slight transparency

    // Transform female dots
    d3.selectAll(".dot")
        .filter((d, i) => i >= maleCount && i < maleCount + femaleCount) // Next 1,060 dots are Female
        .transition() // First transition: Change color
        .duration(1000)
        .attr("fill", "#C11C84") // Set color to light green for Female
        .attr("fill-opacity", 0.4) // Slight transparency

}


function ageRange2020() { 
    const ageData2020 = [ 
        { ageRange: "15 - 24", count: 70 },
        { ageRange: "25 - 29", count: 338 },
        { ageRange: "30 - 34", count: 399 },
        { ageRange: "35 - 39", count: 364 },
        { ageRange: "40 - 44", count: 270 },
        { ageRange: "45 and over", count: 339 }
    ]

    svg.selectAll(".gender-label").remove();
    svg.selectAll(".dots-label").remove();

    const dotsPerRow = 10; // Number of dots per row
    const dotRadius = grid / 8; // Radius of each dot
    const horizontalSpacing = dotRadius * 2 + 4; // Spacing between dots horizontally
    const verticalSpacing = dotRadius * 2 + 4; // Spacing between dots vertically
    const baselineY = HEIGHT - 400; // Baseline position, adjusted to fit the graph within the visible area
    const barSpacing = 20; // Space between bars


    // Calculate total width of the graph
    const totalGraphWidth =
        ageData2020.length * dotsPerRow * horizontalSpacing + (ageData2020.length - 1) * barSpacing;

    // Start the first bar so the graph is centered
    let currentX = 0;

    // Map age data into dots per group
    const ageDotData = ageData2020.map(d => ({
        ...d,
        dots: Math.round(d.count) // Round count to the nearest integer for dots
    }));

    // Add a baseline for the bar graph
    svg.append("line")
        .attr("x1", currentX - barSpacing + 76) // Start of baseline
        .attr("x2", currentX + totalGraphWidth + 57) // End of baseline
        .attr("y1", baselineY+260)
        .attr("y2", baselineY+260)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // Transition dots to form bars
    ageDotData.forEach((group, i) => {
        const groupDots = d3.selectAll(".dot")
            .filter((d, j) => j >= d3.sum(ageDotData.slice(0, i), g => g.dots) && j < d3.sum(ageDotData.slice(0, i + 1), g => g.dots)); // Select dots for this group

        // Transition dots into a rectangular bar
        groupDots
            .transition()
            .duration(1000)
            .attr("cx", (d, j) => currentX + (j % dotsPerRow) * horizontalSpacing - 10) // Position horizontally within the row
            .attr("cy", (d, j) => baselineY - Math.floor(j / dotsPerRow) * verticalSpacing - 30) // Stack rows vertically
            .attr("r", dotRadius) // Adjust dot radius
            .attr("fill", "#F2F2F2")
            .attr("stroke", "black")
            .attr("stroke-width", .5); // Assign a color for the group

        // Add age range label
        svg.append("text")
            .attr("class", "age-label")
            .attr("x", currentX + (dotsPerRow * horizontalSpacing) / 2 + 57) // Centered below the bar
            .attr("y", baselineY + 275) // Below the baseline
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "12px")
            .text(group.ageRange);

        // Add count label
        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", currentX + (dotsPerRow * horizontalSpacing) / 2 + 57) // Centered above the bar
            .attr("y", baselineY - Math.ceil(group.dots / dotsPerRow) * verticalSpacing +250) // Slightly above the bar
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .attr("font-size", "12px")
            .text(group.dots);

        // Move to the next bar position
        currentX += dotsPerRow * horizontalSpacing + barSpacing; // Add spacing between bars
    });
}

function jobType() {
    console.log("Transitioning dots to grouped rectangular shapes...");


    svg.selectAll("line").remove();
    svg.selectAll(".age-label").remove();
    svg.selectAll(".bar-label").remove();
    
    console.log("Displaying job type distribution...");

    const jobData = [
        { jobType: "Farmers and Fishermen (7)", count: 7 },
        { jobType: "Managers (27)", count: 27 },
        { jobType: "Clerical support workers (70)", count: 70 },
        { jobType: "Technicians and Associates (120)", count: 120 },
        { jobType: "Craft and related trade workers (121)", count: 121 },
        { jobType: "Plant and machine operators (205)", count: 205 },
        { jobType: "Service and sales workers (256)", count: 256 },
        { jobType: "Professionals (146)", count: 146 },
        { jobType: "Elementary occupations (829)", count: 829 },
    ].sort((a, b) => b.count - a.count); // Sort jobData by count in descending order

   
    const dotsPerRow = 20; // Number of dots per row in each rectangle
    const maxDotsPerColumn = 829; // Threshold for the maximum number of dots in a column
    const dotRadius = grid / 8; // Radius of each dot
    const horizontalSpacing = dotRadius * 2 + 4; // Spacing between dots horizontally
    const verticalSpacing = dotRadius * 2 + 4; // Spacing between dots vertically
    const columnSpacing = 25; // Space between columns
    const rectangleSpacing = 25; // Vertical spacing between rectangles in the same column

    const startX = 50; // Starting X position for the first column
    const startY = HEIGHT / 16 - 50; // Starting Y position for the first rectangle

    let currentColumnX = startX; // Track the X position of the current column
    let currentColumnHeight = 0; // Track the height of the current column
    let currentColumnDots = 0; // Track the total number of dots in the current column

    // Transition dots to form rectangles
    jobData.forEach((group, groupIndex) => {
        const groupHeight = Math.ceil(group.count / dotsPerRow) * verticalSpacing; // Calculate height of the rectangle

        // Check if we need to start a new column based on the dot threshold
        if (currentColumnDots + group.count > maxDotsPerColumn) {
            currentColumnX += dotsPerRow * horizontalSpacing + columnSpacing; // Move to the next column
            currentColumnHeight = 0; // Reset column height
            currentColumnDots = 0; // Reset dot count for the new column
        }

        const currentY = startY + currentColumnHeight; // Y position for the rectangle

        const groupDots = d3.selectAll(".dot")
            .filter((d, j) => j >= d3.sum(jobData.slice(0, groupIndex), g => g.count) && j < d3.sum(jobData.slice(0, groupIndex + 1), g => g.count)); // Select dots for this group

        // Transition dots into a rectangular shape
        groupDots
            .transition()
            .duration(1000)
            .attr("cx", (d, j) => currentColumnX + (j % dotsPerRow) * horizontalSpacing - 15) // Position horizontally within the row
            .attr("cy", (d, j) => currentY + Math.floor(j / dotsPerRow) * verticalSpacing - 30) // Stack rows vertically
            .attr("r", dotRadius) // Adjust dot radius
            .attr("fill", "white") // White fill for dots
            .attr("stroke", "black"); // Black outline for dots

        // Add job type label below each rectangle
        svg.append("text")
            .attr("class", "group-label")
            .attr("x", currentColumnX + (dotsPerRow * horizontalSpacing)-12) // Centered below the rectangle
            .attr("y", currentY + groupHeight + 268) // Below the last row of dots
            .attr("text-anchor", "middle")
            .attr("font-size", "9px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(group.jobType);


        // Update column height and dot count
        currentColumnHeight += groupHeight + rectangleSpacing; // Add rectangle height and spacing
        currentColumnDots += group.count; // Add the group's dot count
    });
}
var panels = [
    () => {
        setup(2200); // Initial setup with 2,200 dots
        start(2200);
    },
    () => {
        transitionToSecondSection(); // Transition to second section
    }, 

    () => {
        highlightGenderDistribution(); // Highlight gender distribution in the third section
    },

    () => { 

        ageRange2020(); 
    }, 
    () => {
        jobType(); // Job type horizontal bar chart in the fifth section
    }
];

var body = d3.select('body').node();
var container = d3.select('#container');
var content = d3.select('#content');

var SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT;
var scrollTop = 0;
var newScrollTop = 0;

container.on("scroll.scroller", function () {
    newScrollTop = container.node().scrollTop;
});

// Adjust dimensions on window resize
var setDimensions = function () {
    WIDTH = window.innerWidth / 2;
    HEIGHT = window.innerHeight;
    SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT;
};

// Render loop to detect scroll changes and trigger animations
var render = function () {
    if (scrollTop !== newScrollTop) {
        scrollTop = newScrollTop;
        var panelSize = window.innerHeight;
        var panelNumber = Math.floor(scrollTop / panelSize);
        if (panel !== panelNumber && panels[panelNumber]) {
            console.log(`Switching to panel ${panelNumber}`);
            panel = panelNumber;
            panels[panel]();
        }
        currentScrollTop.text(scrollTop);
    }
    window.requestAnimationFrame(render);
};
window.requestAnimationFrame(render);
window.onresize = setDimensions;

// Initial setup
panels[0](); // Start with the first panel
