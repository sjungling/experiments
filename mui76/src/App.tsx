import { useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  AppBar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Window from './components/Window';
import ThemeSwitcher from './components/ThemeSwitcher';
import RoughFilterDefs from './components/RoughFilterDefs';
import { useThemeController } from './theme/ThemeController';

// ── The classic Mac menu bar ─────────────────────────────────────────────────
function MacMenuBar() {
  const menus = ['File', 'Edit', 'View', 'Label', 'Special'];
  return (
    <AppBar>
      <Toolbar variant="dense" sx={{ gap: 2, px: 2, minHeight: 36 }}>
        <Box sx={{ fontSize: 16, lineHeight: 1, pr: 1 }}></Box>
        {menus.map((m) => (
          <Typography key={m} variant="button" sx={{ cursor: 'default', userSelect: 'none' }}>
            {m}
          </Typography>
        ))}
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

// ── The lo-fi wireframe navbar ───────────────────────────────────────────────
function SketchNavbar() {
  const links = ['Dashboard', 'Components', 'Docs'];
  return (
    <AppBar>
      <Toolbar sx={{ gap: 3, px: 3 }}>
        <Typography variant="h6">▢ Component Gallery</Typography>
        <Stack direction="row" gap={2.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {links.map((n, i) => (
            <Typography
              key={n}
              variant="body2"
              sx={{ color: i === 1 ? 'text.primary' : 'text.secondary', cursor: 'default' }}
            >
              {n}
            </Typography>
          ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

// ── The BeOS / Haiku application menu bar ────────────────────────────────────
function BeMenuBar() {
  const menus = ['File', 'Edit', 'Window', 'Settings'];
  return (
    <AppBar>
      <Toolbar variant="dense" sx={{ gap: 2, px: 1.5, minHeight: 34 }}>
        <Box
          sx={{
            bgcolor: '#FFCB00',
            border: '1px solid #4C4C4C',
            borderRadius: '3px',
            px: 1,
            py: '1px',
            fontWeight: 700,
            fontSize: 13,
            color: '#101010',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.5)',
            userSelect: 'none',
          }}
        >
          Be
        </Box>
        {menus.map((m) => (
          <Typography key={m} variant="body2" sx={{ fontWeight: 500, cursor: 'default', userSelect: 'none' }}>
            {m}
          </Typography>
        ))}
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

// ── The Mac OS X Aqua menu bar ───────────────────────────────────────────────
function AquaMenuBar() {
  const menus = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];
  return (
    <AppBar>
      <Toolbar variant="dense" sx={{ gap: 2.5, px: 2, minHeight: 30 }}>
        <Box sx={{ fontSize: 15, lineHeight: 1, color: '#1d1d1f' }}></Box>
        <Typography variant="body2" sx={{ fontWeight: 700, userSelect: 'none' }}>
          Finder
        </Typography>
        {menus.map((m) => (
          <Typography key={m} variant="body2" sx={{ cursor: 'default', userSelect: 'none' }}>
            {m}
          </Typography>
        ))}
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

// ── The NeXTSTEP main menu: a vertical column floating over the workspace ─────
const NEXT_CHISEL = 'inset 2px 2px 0 #fff, inset -2px -2px 0 #565656';

function NextMenuCell({
  label,
  trailing,
  header,
}: {
  label: string;
  trailing?: string;
  header?: boolean;
}) {
  return (
    <Box
      sx={{
        height: 23,
        display: 'flex',
        alignItems: 'center',
        justifyContent: header ? 'center' : 'space-between',
        px: 1,
        bgcolor: '#A8A8A8',
        color: '#000',
        borderBottom: '1px solid #000',
        boxShadow: NEXT_CHISEL,
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        fontSize: 13,
        fontWeight: 700,
        cursor: 'default',
        ...(header
          ? {}
          : { '&:hover': { bgcolor: '#3A3A3A', color: '#fff' } }),
      }}
    >
      <span>{label}</span>
      {trailing ? (
        <Box component="span" sx={{ fontSize: trailing === '▷' ? 11 : 12, fontWeight: 400, opacity: 0.85 }}>
          {trailing}
        </Box>
      ) : null}
    </Box>
  );
}

/** The iconic NeXT main menu — a vertical strip anchored at the workspace's top-left. */
function NextVerticalMenu() {
  const items: Array<{ label: string; trailing: string }> = [
    { label: 'Info', trailing: '▷' },
    { label: 'File', trailing: '▷' },
    { label: 'Edit', trailing: '▷' },
    { label: 'Tools', trailing: '▷' },
    { label: 'Windows', trailing: '▷' },
    { label: 'Services', trailing: '▷' },
    { label: 'Hide', trailing: 'h' },
    { label: 'Quit', trailing: 'q' },
  ];
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 14,
        left: 14,
        width: 168,
        zIndex: 1100,
        border: '1px solid #000',
        boxShadow: '4px 4px 9px rgba(0,0,0,0.45)',
        userSelect: 'none',
      }}
    >
      <NextMenuCell label="Workspace" header />
      {items.map((it) => (
        <NextMenuCell key={it.label} label={it.label} trailing={it.trailing} />
      ))}
      <Box sx={{ p: 0.75, bgcolor: '#A8A8A8', boxShadow: NEXT_CHISEL }}>
        <ThemeSwitcher />
      </Box>
    </Box>
  );
}

// ── The Excalidraw "menu" bar ────────────────────────────────────────────────
function ExcalidrawMenuBar() {
  const links = ['File', 'Edit', 'View', 'Help'];
  return (
    <AppBar>
      <Toolbar sx={{ gap: 3, px: 3 }}>
        <Typography variant="h6" sx={{ color: 'primary.dark' }}>
          ✏️ Component Gallery
        </Typography>
        <Stack direction="row" gap={2.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {links.map((n) => (
            <Typography key={n} variant="body2" sx={{ color: 'text.secondary', cursor: 'default' }}>
              {n}
            </Typography>
          ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

// ── The Plan 9 acme tag bar ──────────────────────────────────────────────────
function Plan9TagBar() {
  const commands = ['Newcol', 'Kill', 'Putall', 'Dump', 'Exit'];
  return (
    <AppBar>
      <Toolbar variant="dense" sx={{ gap: 2, px: 1.5, minHeight: 30 }}>
        {commands.map((c) => (
          <Typography key={c} variant="body2" sx={{ cursor: 'default', userSelect: 'none' }}>
            {c}
          </Typography>
        ))}
        <Typography variant="body2" sx={{ color: 'text.secondary', userSelect: 'none' }}>
          | Component Gallery
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

// ── The Frutiger Aero glass top bar ──────────────────────────────────────────
function AeroMenuBar() {
  const links = ['File', 'Edit', 'View', 'Help'];
  return (
    <AppBar>
      <Toolbar sx={{ gap: 2.5, px: 2 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundImage: 'radial-gradient(circle at 50% 28%, #d6f0ff, #1f8fd6 78%, #135f9c)',
            border: '1px solid #1565A0',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.25)',
          }}
        />
        <Typography variant="h6">Component Gallery</Typography>
        <Stack direction="row" gap={2.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {links.map((n) => (
            <Typography key={n} variant="body2" sx={{ color: 'text.secondary', cursor: 'default' }}>
              {n}
            </Typography>
          ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

// ── The CRT terminal prompt bar ──────────────────────────────────────────────
function CrtPrompt() {
  return (
    <AppBar>
      <Toolbar variant="dense" sx={{ gap: 1, px: 1.5, minHeight: 34 }}>
        <Typography sx={{ fontFamily: "'VT323', monospace", fontSize: 18, userSelect: 'none' }}>
          guest@mui76:~$ ./component-gallery
        </Typography>
        {/* blinking block cursor (keyframes defined in the CRT theme) */}
        <Box sx={{ width: 9, height: 17, bgcolor: '#3BFF6E', animation: 'crt-blink 1.1s steps(1) infinite' }} />
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

// ── Top bar that morphs with the active theme ────────────────────────────────
function TopBar() {
  const { themeKey } = useThemeController();
  if (themeKey === 'sketch') return <SketchNavbar />;
  if (themeKey === 'beos') return <BeMenuBar />;
  if (themeKey === 'aqua') return <AquaMenuBar />;
  if (themeKey === 'nextstep') return <NextVerticalMenu />;
  if (themeKey === 'excalidraw') return <ExcalidrawMenuBar />;
  if (themeKey === 'plan9') return <Plan9TagBar />;
  if (themeKey === 'aero') return <AeroMenuBar />;
  if (themeKey === 'crt') return <CrtPrompt />;
  return <MacMenuBar />;
}

// ── A labelled row that groups related demo controls ─────────────────────────
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack spacing={1}>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
        {children}
      </Stack>
    </Stack>
  );
}

function TabPanel({ value, index, children }: { value: number; index: number; children: ReactNode }) {
  if (value !== index) return null;
  return <Box sx={{ p: 2 }}>{children}</Box>;
}

export default function App() {
  const { themeKey } = useThemeController();
  const subtitle =
    themeKey === 'sketch'
      ? 'A Material UI theme styled after a lo-fi wireframe prototyping kit.'
      : themeKey === 'beos'
        ? 'A Material UI theme inspired by BeOS & Haiku.'
        : themeKey === 'aqua'
          ? 'A Material UI theme dripping with Mac OS X Aqua gloss.'
          : themeKey === 'nextstep'
            ? 'A Material UI theme chiseled out of NeXTSTEP gray.'
            : themeKey === 'excalidraw'
              ? 'A Material UI theme that looks hand-drawn in Excalidraw.'
              : themeKey === 'plan9'
                ? 'A Material UI theme in the flat pastels of Plan 9 (rio / acme).'
                : themeKey === 'aero'
                  ? 'A Material UI theme glossed up in Frutiger Aero glass.'
                  : themeKey === 'crt'
                    ? 'A Material UI theme glowing on a green-phosphor CRT.'
                    : 'A Material UI theme dressed up as Macintosh System 7.6 & HyperCard.';

  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [checks, setChecks] = useState({ chooser: true, balloon: false, sound: true });
  const [fill, setFill] = useState('pattern');
  const [sharing, setSharing] = useState(true);
  const [volume, setVolume] = useState(7);
  const [font, setFont] = useState('chicago');
  const [text, setText] = useState('Welcome to Macintosh');
  const [selectedFile, setSelectedFile] = useState(1);

  const files = [
    { name: 'Read Me', kind: 'TeachText document', icon: <DescriptionOutlinedIcon fontSize="small" /> },
    { name: 'System Folder', kind: 'Folder', icon: <FolderOutlinedIcon fontSize="small" /> },
    { name: 'Scrapbook File', kind: 'System document', icon: <DescriptionOutlinedIcon fontSize="small" /> },
    { name: 'HyperCard', kind: 'Application program', icon: <FolderOutlinedIcon fontSize="small" /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', pb: 6, position: 'relative' }}>
      <RoughFilterDefs />
      <TopBar />

      <Box
        sx={{
          pt: 3,
          pr: { xs: 2, md: 4 },
          // NeXTSTEP's menu floats in a left gutter, so clear room for it.
          pl: themeKey === 'nextstep' ? '196px' : { xs: 2, md: 4 },
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h2">Component Gallery</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          {/* ── Buttons ─────────────────────────────────────────────────── */}
          <Window title="Buttons">
            <Stack spacing={2.5}>
              <Row label="Push Buttons">
                <Button>Cancel</Button>
                <Button variant="contained">OK</Button>
                <Button variant="text">More Info…</Button>
                <Button disabled>Disabled</Button>
              </Row>
              <Row label="Button Group">
                <ButtonGroup>
                  <Button>Cut</Button>
                  <Button>Copy</Button>
                  <Button>Paste</Button>
                </ButtonGroup>
              </Row>
              <Row label="Icon Buttons">
                <Tooltip title="Save">
                  <IconButton>
                    <SaveOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print">
                  <IconButton>
                    <PrintOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Find">
                  <IconButton>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Throw away">
                  <IconButton>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Badge badgeContent={3}>
                  <IconButton>
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                </Badge>
              </Row>
            </Stack>
          </Window>

          {/* ── Form controls ───────────────────────────────────────────── */}
          <Window title="Controls">
            <Stack spacing={2.5}>
              <TextField
                label="Document name"
                value={text}
                onChange={(e) => setText(e.target.value)}
                helperText="Type a name for this card."
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="font-label">Font</InputLabel>
                <Select
                  labelId="font-label"
                  label="Font"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                >
                  <MenuItem value="chicago">Chicago</MenuItem>
                  <MenuItem value="geneva">Geneva</MenuItem>
                  <MenuItem value="monaco">Monaco</MenuItem>
                  <MenuItem value="newyork">New York</MenuItem>
                </Select>
              </FormControl>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.chooser}
                      onChange={(e) => setChecks({ ...checks, chooser: e.target.checked })}
                    />
                  }
                  label="Show the Chooser"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checks.balloon}
                      onChange={(e) => setChecks({ ...checks, balloon: e.target.checked })}
                    />
                  }
                  label="Balloon Help"
                />
              </FormGroup>

              <FormControl>
                <FormLabel>Fill pattern</FormLabel>
                <RadioGroup row value={fill} onChange={(e) => setFill(e.target.value)}>
                  <FormControlLabel value="pattern" control={<Radio />} label="Pattern" />
                  <FormControlLabel value="white" control={<Radio />} label="White" />
                  <FormControlLabel value="black" control={<Radio />} label="Black" />
                </RadioGroup>
              </FormControl>

              <FormControlLabel
                control={<Switch checked={sharing} onChange={(e) => setSharing(e.target.checked)} />}
                label="File Sharing on"
              />

              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  <VolumeUpIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Speaker volume
                </Typography>
                <Slider
                  value={volume}
                  onChange={(_, v) => setVolume(v as number)}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Stack>
            </Stack>
          </Window>

          {/* ── Feedback ────────────────────────────────────────────────── */}
          <Window title="Alerts &amp; Progress">
            <Stack spacing={2}>
              <Alert severity="info">
                <AlertTitle>Note</AlertTitle>
                The disk &ldquo;Macintosh HD&rdquo; is now available.
              </Alert>
              <Alert severity="success">File copied successfully.</Alert>
              <Alert severity="warning">This disk is almost full.</Alert>
              <Alert severity="error">
                <AlertTitle>Bomb</AlertTitle>
                A system error has occurred. ID = 02
              </Alert>

              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  Copying… 64%
                </Typography>
                <LinearProgress variant="determinate" value={64} />
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  Rebuilding desktop…
                </Typography>
                <LinearProgress />
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                <CircularProgress size={28} />
                <Chip label="System 7.6" />
                <Chip label="Read Only" variant="outlined" />
                <Chip label="Locked" onDelete={() => undefined} />
              </Stack>
            </Stack>
          </Window>

          {/* ── Surfaces & navigation (spans wide) ──────────────────────── */}
          <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
            <Window title="Surfaces" disablePadding>
              <Box>
                <Tabs value={tab} onChange={(_: SyntheticEvent, v: number) => setTab(v)} sx={{ px: 1, pt: 1 }}>
                  <Tab label="Home" />
                  <Tab label="Cards" />
                  <Tab label="About" />
                </Tabs>

                <TabPanel value={tab} index={0}>
                  <Typography variant="h4" gutterBottom>
                    Stack
                  </Typography>
                  <Typography variant="body1">
                    HyperCard is a software erector set that lets you build your own stacks of cards.
                    Each card can hold text, pictures, buttons, and fields.
                  </Typography>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <Stack spacing={1}>
                    {['Address Card', 'Phone List', 'To Do', 'Calendar'].map((c, i) => (
                      <Accordion key={c} defaultExpanded={i === 0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>{c}</AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2">
                            The {c.toLowerCase()} stack stores its records on individual cards you can
                            flip through with the arrow keys.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  <Typography variant="body1">
                    This Macintosh is running System 7.6. HyperCard 2.4 is installed. Click the buttons
                    below to summon a dialog box or a pull-down menu.
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => setDialogOpen(true)}>
                      Show Dialog…
                    </Button>
                    <Button onClick={(e) => setMenuAnchor(e.currentTarget)}>Open Menu ▾</Button>
                  </Stack>
                </TabPanel>
              </Box>
            </Window>
          </Box>

          {/* ── Data: table ─────────────────────────────────────────────── */}
          <Box sx={{ gridColumn: { xs: '1', md: 'span 1', lg: 'span 2' } }}>
            <Window title="Get Info" disablePadding>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Kind</TableCell>
                      <TableCell align="right">Size</TableCell>
                      <TableCell align="right">Modified</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      ['System', 'Suitcase', '2.4 MB', '7/26/97'],
                      ['Finder', 'Application', '1.1 MB', '7/26/97'],
                      ['Note Pad File', 'Document', '4 K', '8/02/97'],
                      ['Clipboard', 'System document', '8 K', '8/02/97'],
                    ].map((r) => (
                      <TableRow key={r[0]} hover>
                        <TableCell>{r[0]}</TableCell>
                        <TableCell>{r[1]}</TableCell>
                        <TableCell align="right">{r[2]}</TableCell>
                        <TableCell align="right">{r[3]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Window>
          </Box>

          {/* ── Data: list ──────────────────────────────────────────────── */}
          <Window title="Macintosh HD" disablePadding>
            <List>
              {files.map((f, i) => (
                <ListItemButton
                  key={f.name}
                  selected={selectedFile === i}
                  onClick={() => setSelectedFile(i)}
                  divider
                >
                  <ListItemIcon>{f.icon}</ListItemIcon>
                  <ListItemText primary={f.name} secondary={f.kind} />
                </ListItemButton>
              ))}
            </List>
          </Window>
        </Box>
      </Box>

      {/* ── Overlays ──────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Save changes?</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText>
            Do you want to save the changes you made to the document &ldquo;{text}&rdquo; before
            closing?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button variant="text" onClick={() => setDialogOpen(false)}>
            Don&rsquo;t Save
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => setMenuAnchor(null)}>New Card&ensp;&#8984;N</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>Open Stack…&ensp;&#8984;O</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>Close&ensp;&#8984;W</MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchor(null)}>Quit&ensp;&#8984;Q</MenuItem>
      </Menu>
    </Box>
  );
}
