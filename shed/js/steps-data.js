// Step data with piece IDs and screws instead of nails where possible
const steps = [
    {
        title: "Step 1: Foundation Layout",
        materials: [
            { name: "Concrete Deck Blocks (F-BLK-01 to F-BLK-12)", qty: "12" },
            { name: "Pea Gravel (0.5 cu ft bags)", qty: "3" },
            { name: "Landscape Fabric (3'×50')", qty: "1 roll" }
        ],
        instructions: [
            "Clear and level a 10' × 12' area (extra space for work room)",
            "Lay landscape fabric over the entire area",
            "Place corner blocks: <strong>F-BLK-01</strong> (front-left), <strong>F-BLK-02</strong> (front-right), <strong>F-BLK-03</strong> (back-left), <strong>F-BLK-04</strong> (back-right)",
            "Place mid-span blocks: <strong>F-BLK-05</strong> (front center), <strong>F-BLK-06</strong> (back center)",
            "Place side blocks: <strong>F-BLK-07</strong> & <strong>F-BLK-08</strong> (left side), <strong>F-BLK-09</strong> & <strong>F-BLK-10</strong> (right side)",
            "Place interior supports: <strong>F-BLK-11</strong> & <strong>F-BLK-12</strong> under center joist lines",
            "Check level across all blocks using a long straight edge, adjust gravel until within 1/4\""
        ],
        tip: "Use a string line and line level to ensure blocks are level across the entire span. This is critical - an unlevel foundation causes problems throughout the build.",
        pieces: ["F-BLK-01", "F-BLK-02", "F-BLK-03", "F-BLK-04", "F-BLK-05", "F-BLK-06", "F-BLK-07", "F-BLK-08", "F-BLK-09", "F-BLK-10", "F-BLK-11", "F-BLK-12"]
    },
    {
        title: "Step 2: Floor Frame",
        materials: [
            { name: "2×6 PT Rim Joists (FL-RIM-01 to FL-RIM-04)", qty: "4 pcs" },
            { name: "2×6 PT Floor Joists (FL-JST-01 to FL-JST-08)", qty: "8 pcs" },
            { name: "Joist Hangers (Simpson LUS26)", qty: "16" },
            { name: "3\" Exterior Screws (deck screws)", qty: "1 lb" },
            { name: "1-1/2\" Joist Hanger Screws", qty: "1 box" }
        ],
        instructions: [
            "Cut <strong>FL-RIM-01</strong> and <strong>FL-RIM-02</strong> to 10' for front and back rim joists",
            "Cut <strong>FL-RIM-03</strong> and <strong>FL-RIM-04</strong> to 7'-9\" for left and right rim joists",
            "Pre-drill and screw the rectangular frame together with 3\" screws (3 per corner)",
            "Square the frame by measuring diagonals (should be equal)",
            "Mark joist locations at 16.5\" O.C. on <strong>FL-RIM-01</strong> and <strong>FL-RIM-02</strong>",
            "Install joist hangers at each mark using joist hanger screws",
            "Cut floor joists <strong>FL-JST-01</strong> through <strong>FL-JST-08</strong> to 7'-9\" and install in hangers",
            "Place completed frame on foundation blocks <strong>F-BLK-01</strong> through <strong>F-BLK-12</strong>"
        ],
        tip: "Use structural screws rated for outdoor use. Pre-drill all holes in PT lumber to prevent splitting - the wood is wet and dense.",
        pieces: ["FL-RIM-01", "FL-RIM-02", "FL-RIM-03", "FL-RIM-04", "FL-JST-01", "FL-JST-02", "FL-JST-03", "FL-JST-04", "FL-JST-05", "FL-JST-06", "FL-JST-07", "FL-JST-08"]
    },
    {
        title: "Step 3: Floor Deck",
        materials: [
            { name: "3/4\" OSB Subfloor (FL-DK-01 to FL-DK-03)", qty: "3 sheets" },
            { name: "Construction Adhesive", qty: "1 tube" },
            { name: "2\" Exterior Screws", qty: "1 lb" }
        ],
        instructions: [
            "Start at back-left corner with <strong>FL-DK-01</strong> (full 4'×8' sheet)",
            "Apply construction adhesive in a zigzag pattern on joists",
            "Lay <strong>FL-DK-01</strong> and screw every 6\" on edges, 12\" in field",
            "Install <strong>FL-DK-02</strong> at back-right, butting tightly against FL-DK-01",
            "Rip <strong>FL-DK-03</strong> to 4' wide and install along the front edge",
            "Stagger end joints between sheets for strength",
            "Ensure all edges are supported by joists <strong>FL-JST-01</strong> through <strong>FL-JST-08</strong>"
        ],
        tip: "Leave a 1/8\" gap at all panel edges for expansion. Screws hold better than nails and won't pop up over time.",
        pieces: ["FL-DK-01", "FL-DK-02", "FL-DK-03"]
    },
    {
        title: "Step 4: Back Wall",
        materials: [
            { name: "2×4 Bottom Plate (BW-BP-01)", qty: "1 pc @ 10'" },
            { name: "2×4 Top Plates (BW-TP-01, BW-TP-02)", qty: "2 pcs @ 10'" },
            { name: "2×4 Studs (BW-ST-01 to BW-ST-09)", qty: "9 pcs @ 69\"" },
            { name: "3\" Framing Screws", qty: "1 lb" }
        ],
        instructions: [
            "Cut 9 studs <strong>BW-ST-01</strong> through <strong>BW-ST-09</strong> to 69\" each",
            "Cut <strong>BW-BP-01</strong> (bottom plate) and <strong>BW-TP-01</strong>, <strong>BW-TP-02</strong> (top plates) to 10'",
            "Mark stud layout on plates at 16.5\" O.C., starting with <strong>BW-ST-01</strong> at left corner",
            "Lay out plates and studs on floor deck <strong>FL-DK-01/02/03</strong>",
            "Drive 2 screws through <strong>BW-BP-01</strong> into each stud end",
            "Attach <strong>BW-TP-01</strong> to top of studs with 2 screws each",
            "Raise wall, check plumb, screw <strong>BW-BP-01</strong> to floor deck with 3\" screws every 16\"",
            "Brace wall temporarily with diagonal 2×4, then attach <strong>BW-TP-02</strong> (second top plate)"
        ],
        tip: "Build all walls flat on the deck, then raise them. Chalk a line 3.5\" from the deck edge to align the wall's outer face.",
        pieces: ["BW-BP-01", "BW-TP-01", "BW-TP-02", "BW-ST-01", "BW-ST-02", "BW-ST-03", "BW-ST-04", "BW-ST-05", "BW-ST-06", "BW-ST-07", "BW-ST-08", "BW-ST-09"]
    },
    {
        title: "Step 5: Left Wall",
        materials: [
            { name: "2×4 Bottom Plate (LW-BP-01)", qty: "1 pc @ 7'-5\"" },
            { name: "2×4 Top Plates (LW-TP-01, LW-TP-02)", qty: "2 pcs @ 7'-5\"" },
            { name: "2×4 Studs (LW-ST-01 to LW-ST-07)", qty: "7 pcs @ 69\"" },
            { name: "3\" Framing Screws", qty: "0.5 lb" }
        ],
        instructions: [
            "Cut 7 studs <strong>LW-ST-01</strong> through <strong>LW-ST-07</strong> to 69\" each",
            "Cut plates <strong>LW-BP-01</strong>, <strong>LW-TP-01</strong>, <strong>LW-TP-02</strong> to 7'-5\" (89\")",
            "Mark stud layout on plates at 16.5\" O.C., starting with <strong>LW-ST-01</strong> at front",
            "Build wall flat on deck: screw studs between plates (2 screws each end)",
            "Raise wall, butt <strong>LW-ST-07</strong> against <strong>BW-ST-01</strong> at back wall corner",
            "Screw through <strong>LW-ST-07</strong> into back wall corner (4-5 screws)",
            "Screw <strong>LW-BP-01</strong> to floor deck with 3\" screws every 16\"",
            "Check wall for plumb and brace temporarily"
        ],
        tip: "The side walls are shorter (7'-5\") to fit between the front and back walls (each 3.5\" thick). Measure your actual opening before cutting plates.",
        pieces: ["LW-BP-01", "LW-TP-01", "LW-TP-02", "LW-ST-01", "LW-ST-02", "LW-ST-03", "LW-ST-04", "LW-ST-05", "LW-ST-06", "LW-ST-07"]
    },
    {
        title: "Step 6: Right Wall",
        materials: [
            { name: "2×4 Bottom Plate (RW-BP-01)", qty: "1 pc @ 7'-5\"" },
            { name: "2×4 Top Plates (RW-TP-01, RW-TP-02)", qty: "2 pcs @ 7'-5\"" },
            { name: "2×4 Studs (RW-ST-01 to RW-ST-07)", qty: "7 pcs @ 69\"" },
            { name: "3\" Framing Screws", qty: "0.5 lb" }
        ],
        instructions: [
            "Cut 7 studs <strong>RW-ST-01</strong> through <strong>RW-ST-07</strong> to 69\" each",
            "Cut plates <strong>RW-BP-01</strong>, <strong>RW-TP-01</strong>, <strong>RW-TP-02</strong> to 7'-5\" (89\")",
            "Mark stud layout on plates at 16.5\" O.C., starting with <strong>RW-ST-01</strong> at front",
            "Build wall flat on deck: screw studs between plates (2 screws each end)",
            "Raise wall, butt <strong>RW-ST-07</strong> against <strong>BW-ST-09</strong> at back wall corner",
            "Screw through <strong>RW-ST-07</strong> into back wall corner (4-5 screws)",
            "Screw <strong>RW-BP-01</strong> to floor deck with 3\" screws every 16\"",
            "Check wall for plumb and brace temporarily"
        ],
        tip: "Mirror the left wall construction. With both side walls up and braced, the structure is now stable enough to proceed with the front wall.",
        pieces: ["RW-BP-01", "RW-TP-01", "RW-TP-02", "RW-ST-01", "RW-ST-02", "RW-ST-03", "RW-ST-04", "RW-ST-05", "RW-ST-06", "RW-ST-07"]
    },
    {
        title: "Step 7: Front Wall",
        materials: [
            { name: "2×4 Bottom Plates (FW-BP-01, FW-BP-02)", qty: "2 pcs @ 31\"" },
            { name: "2×4 Top Plates (FW-TP-01, FW-TP-02)", qty: "2 pcs @ 10'" },
            { name: "2×4 King Studs (FW-KS-01, FW-KS-02)", qty: "2 pcs @ 69\"" },
            { name: "2×4 Jack Studs (FW-JS-01, FW-JS-02)", qty: "2 pcs @ 80\"" },
            { name: "2×6 Header (FW-HD-01, FW-HD-02, FW-HD-03)", qty: "2×6 + plywood" },
            { name: "2×4 Corner/Cripple Studs (FW-ST-01 to 04, FW-CR-01 to 03)", qty: "7 pcs" },
            { name: "3\" Framing Screws", qty: "1 lb" }
        ],
        instructions: [
            "Cut bottom plates: <strong>FW-BP-01</strong> (31\" left of door) and <strong>FW-BP-02</strong> (31\" right of door)",
            "Cut king studs <strong>FW-KS-01</strong> and <strong>FW-KS-02</strong> to 69\" (full height)",
            "Cut jack studs <strong>FW-JS-01</strong> and <strong>FW-JS-02</strong> to 80\" (header height)",
            "Build header: sandwich <strong>FW-HD-03</strong> (1/2\" plywood) between <strong>FW-HD-01</strong> and <strong>FW-HD-02</strong> (2×6s), screw together",
            "Assemble wall: <strong>FW-ST-01</strong> at left corner, then <strong>FW-ST-02</strong>, then <strong>FW-KS-01</strong> with <strong>FW-JS-01</strong> attached",
            "Set header on jack studs, add cripples <strong>FW-CR-01</strong>, <strong>FW-CR-02</strong>, <strong>FW-CR-03</strong> above header",
            "Continue: <strong>FW-KS-02</strong> + <strong>FW-JS-02</strong>, then <strong>FW-ST-03</strong>, then <strong>FW-ST-04</strong> at right corner",
            "Attach top plates <strong>FW-TP-01</strong> and <strong>FW-TP-02</strong>",
            "Raise wall and screw to floor and side walls (<strong>LW-ST-01</strong> and <strong>RW-ST-01</strong>)"
        ],
        tip: "The door rough opening is 38\" wide (between jack studs) to allow 1\" shimming space on each side of a 36\" door.",
        pieces: ["FW-BP-01", "FW-BP-02", "FW-TP-01", "FW-TP-02", "FW-KS-01", "FW-KS-02", "FW-JS-01", "FW-JS-02", "FW-HD-01", "FW-HD-02", "FW-HD-03", "FW-CR-01", "FW-CR-02", "FW-CR-03", "FW-ST-01", "FW-ST-02", "FW-ST-03", "FW-ST-04"]
    },
    {
        title: "Step 8: Roof Framing",
        materials: [
            { name: "2×6 Ridge Board (RF-RDG-01)", qty: "1 pc @ 10'-6\"" },
            { name: "2×4 Rafters (RF-RAF-01 to RF-RAF-18)", qty: "18 pcs @ 51\"" },
            { name: "2×4 Collar Ties (RF-CT-01 to RF-CT-05)", qty: "5 pcs @ 48\"" },
            { name: "2×4 Gable Studs (RF-GB-01 to RF-GB-06)", qty: "6 pcs (cut to fit)" },
            { name: "Hurricane Ties (Simpson H2.5A)", qty: "18" },
            { name: "3\" Framing Screws", qty: "1 lb" },
            { name: "1-1/2\" Hurricane Tie Screws", qty: "1 box" }
        ],
        instructions: [
            "Cut <strong>RF-RDG-01</strong> (ridge board) to 10'-6\" to include overhang",
            "Cut rafter pattern: 51\" with bird's mouth notch and plumb cuts for 4:12 pitch",
            "Use pattern to cut all 18 rafters <strong>RF-RAF-01</strong> through <strong>RF-RAF-18</strong>",
            "Set <strong>RF-RDG-01</strong> on temporary supports at peak height",
            "Install rafters in opposing pairs: <strong>RF-RAF-01</strong>/<strong>RF-RAF-02</strong> at front gable, screw to ridge",
            "Continue with pairs 3/4, 5/6, 7/8, 9/10, 11/12, 13/14, 15/16, 17/18 at 16.5\" O.C.",
            "Install collar ties <strong>RF-CT-01</strong> through <strong>RF-CT-05</strong> on alternate rafter pairs",
            "Cut and install gable studs <strong>RF-GB-01</strong> to <strong>RF-GB-06</strong> at front and back (cut to pitch angle)",
            "Secure all rafters with hurricane ties to wall top plates"
        ],
        tip: "For 4:12 pitch with 4' run, rise is 16\". Hurricane ties are critical - they keep the roof attached in high winds.",
        pieces: ["RF-RDG-01", "RF-RAF-01", "RF-RAF-02", "RF-RAF-03", "RF-RAF-04", "RF-RAF-05", "RF-RAF-06", "RF-RAF-07", "RF-RAF-08", "RF-RAF-09", "RF-RAF-10", "RF-RAF-11", "RF-RAF-12", "RF-RAF-13", "RF-RAF-14", "RF-RAF-15", "RF-RAF-16", "RF-RAF-17", "RF-RAF-18", "RF-CT-01", "RF-CT-02", "RF-CT-03", "RF-CT-04", "RF-CT-05", "RF-GB-01", "RF-GB-02", "RF-GB-03", "RF-GB-04", "RF-GB-05", "RF-GB-06"]
    },
    {
        title: "Step 9: Sheathing & Siding",
        materials: [
            { name: "7/16\" OSB Roof Sheathing (SH-RF-01 to SH-RF-05)", qty: "5 sheets" },
            { name: "LP SmartSide Panels (SD-BW-01/02, SD-FW-01/02, SD-LW-01, SD-RW-01, SD-GB-01)", qty: "7 panels" },
            { name: "1×4 Corner Trim (TR-CN-01 to TR-CN-08)", qty: "8 pcs @ 8'" },
            { name: "8d Galv. Siding Nails", qty: "5 lbs" },
            { name: "2\" Exterior Screws (for roof OSB)", qty: "2 lbs" }
        ],
        instructions: [
            "Install roof sheathing: <strong>SH-RF-01</strong> on left slope bottom, <strong>SH-RF-02</strong> at left top",
            "Continue: <strong>SH-RF-03</strong> on right slope bottom, <strong>SH-RF-04</strong> at right top",
            "Cut gable triangles from <strong>SH-RF-05</strong> to fill gable ends",
            "Screw roof OSB 6\" O.C. on edges, 12\" in field into rafters <strong>RF-RAF-01</strong> through <strong>RF-RAF-18</strong>",
            "Install <strong>SD-BW-01</strong> and <strong>SD-BW-02</strong> on back wall over studs <strong>BW-ST-01</strong> to <strong>BW-ST-09</strong>",
            "Install <strong>SD-LW-01</strong> on left wall, <strong>SD-RW-01</strong> on right wall",
            "Install <strong>SD-FW-01</strong> left of door, <strong>SD-FW-02</strong> OVER door opening (full panel)",
            "Cut out door opening from <strong>SD-FW-02</strong> after secured — <strong>SAVE THIS PIECE as DR-PN-01!</strong>",
            "Nail siding 6\" O.C. edges, 12\" field (nails required by manufacturer)",
            "Screw corner trim <strong>TR-CN-01</strong> through <strong>TR-CN-08</strong> at all four corners"
        ],
        tip: "LP SmartSide requires nails per manufacturer specs, but screws are fine for roof OSB and trim. The door cutout from SD-FW-02 becomes DR-PN-01!",
        pieces: ["SH-RF-01", "SH-RF-02", "SH-RF-03", "SH-RF-04", "SH-RF-05", "SD-BW-01", "SD-BW-02", "SD-FW-01", "SD-FW-02", "SD-LW-01", "SD-RW-01", "SD-GB-01", "TR-CN-01", "TR-CN-02", "TR-CN-03", "TR-CN-04", "TR-CN-05", "TR-CN-06", "TR-CN-07", "TR-CN-08"]
    },
    {
        title: "Step 10: Build the Door",
        materials: [
            { name: "Door Panel (DR-PN-01 - from SD-FW-02 cutout)", qty: "1 pc @ 35\"×79\"" },
            { name: "2×4 Stiles (DR-ST-01, DR-ST-02)", qty: "2 pcs @ 79\"" },
            { name: "2×4 Rails (DR-RL-01, DR-RL-02, DR-RL-03)", qty: "3 pcs @ 32\"" },
            { name: "1×4 Door Trim (DR-TR-01/02/03)", qty: "3 pcs (optional)" },
            { name: "1×4 Jambs (DR-JB-01, DR-JB-02, DR-JB-03)", qty: "3 pcs" },
            { name: "1×2 Door Stops (DR-ST-03/04/05)", qty: "3 pcs" },
            { name: "T-Hinges 8\" (heavy duty)", qty: "3" },
            { name: "Gate Latch or Barrel Bolt", qty: "1" },
            { name: "Construction Adhesive + 1-5/8\" Screws", qty: "1 tube + 1 box" }
        ],
        instructions: [
            "Trim <strong>DR-PN-01</strong> (the cutout from SD-FW-02) to exactly 35\" × 79\"",
            "Cut stiles: <strong>DR-ST-01</strong> (left, 79\") and <strong>DR-ST-02</strong> (right, 79\")",
            "Cut rails: <strong>DR-RL-01</strong> (top, 32\"), <strong>DR-RL-02</strong> (middle, 32\"), <strong>DR-RL-03</strong> (bottom, 32\")",
            "Lay <strong>DR-PN-01</strong> face-down, position stiles and rails on back to form frame",
            "Place <strong>DR-RL-02</strong> at 36\" from bottom for extra rigidity",
            "Glue and screw frame to panel with 1-5/8\" screws every 8\"",
            "Optional: attach face trim <strong>DR-TR-01</strong>, <strong>DR-TR-02</strong>, <strong>DR-TR-03</strong> to front edges",
            "Install jambs in rough opening: <strong>DR-JB-01</strong> (left), <strong>DR-JB-02</strong> (right), <strong>DR-JB-03</strong> (head)",
            "Mount 3 T-hinges to door: 6\" from top, 6\" from bottom, one centered",
            "Hang door, shim for 1/4\" gap, screw hinges to <strong>DR-JB-01</strong> with 3\" screws",
            "Install door stops <strong>DR-ST-03</strong>, <strong>DR-ST-04</strong>, <strong>DR-ST-05</strong> on jambs",
            "Install latch on door and strike plate on jamb"
        ],
        tip: "Building your door from the siding cutout (DR-PN-01 from SD-FW-02) saves ~$250 and matches perfectly! Use 3 heavy-duty hinges - shed doors take a beating.",
        pieces: ["DR-PN-01", "DR-ST-01", "DR-ST-02", "DR-RL-01", "DR-RL-02", "DR-RL-03", "DR-TR-01", "DR-TR-02", "DR-TR-03", "DR-JB-01", "DR-JB-02", "DR-JB-03", "DR-ST-03", "DR-ST-04", "DR-ST-05"]
    },
    {
        title: "Step 11: Roofing & Finish",
        materials: [
            { name: "Drip Edge (RF-DE-01 to RF-DE-06)", qty: "6 pcs" },
            { name: "15# Roofing Felt (RF-FT-01)", qty: "1 roll" },
            { name: "3-Tab Shingles (RF-SH-01/02/03)", qty: "3 bundles" },
            { name: "Roofing Nails (1-1/4\")", qty: "2 lbs" },
            { name: "1\" Roofing Screws (for drip edge)", qty: "1 box" },
            { name: "Exterior Caulk", qty: "3 tubes" }
        ],
        instructions: [
            "Screw drip edge <strong>RF-DE-01</strong> along left eave, <strong>RF-DE-02</strong> along right eave (every 12\")",
            "Roll out <strong>RF-FT-01</strong> (roofing felt), overlap seams 4\", staple in place",
            "Screw rake drip edges: <strong>RF-DE-03</strong>/<strong>RF-DE-04</strong> (front), <strong>RF-DE-05</strong>/<strong>RF-DE-06</strong> (back) over felt",
            "Snap chalk lines for shingle courses (5\" exposure)",
            "Install starter strip along eave edge",
            "Open <strong>RF-SH-01</strong>, <strong>RF-SH-02</strong>, <strong>RF-SH-03</strong> and nail shingles from bottom up, stagger joints 6\"",
            "Cut and bend shingles for ridge cap using remaining material from <strong>RF-SH-03</strong>",
            "Caulk all siding joints around <strong>TR-CN-01</strong> through <strong>TR-CN-08</strong>",
            "Caulk door frame around <strong>DR-JB-01</strong>, <strong>DR-JB-02</strong>, <strong>DR-JB-03</strong>",
            "Prime and paint all cut edges of LP SmartSide panels",
            "Apply two coats of exterior paint to entire shed"
        ],
        tip: "Shingles require nails (manufacturer spec), but drip edge holds better with screws. Paint LP SmartSide within 180 days!",
        pieces: ["RF-DE-01", "RF-DE-02", "RF-DE-03", "RF-DE-04", "RF-DE-05", "RF-DE-06", "RF-FT-01", "RF-SH-01", "RF-SH-02", "RF-SH-03"]
    }
];
