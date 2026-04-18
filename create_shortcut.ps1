$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("c:\Users\marce\OneDrive\Área de Trabalho\Software da Allanda.lnk")
$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = """c:\Users\marce\OneDrive\Área de Trabalho\Software da Allanda\run.vbs"""
$Shortcut.IconLocation = "c:\Users\marce\OneDrive\Área de Trabalho\Software da Allanda\icon.ico"
$Shortcut.WorkingDirectory = "c:\Users\marce\OneDrive\Área de Trabalho\Software da Allanda"
$Shortcut.Save()

# Also try to create on standard Desktop just in case 'Área de Trabalho' is the same or OneDrive mapping is weird
try {
    $DesktopPath = [Environment]::GetFolderPath("Desktop")
    $Shortcut2 = $WshShell.CreateShortcut("$DesktopPath\Software da Allanda.lnk")
    $Shortcut2.TargetPath = "wscript.exe"
    $Shortcut2.Arguments = """c:\Users\marce\OneDrive\Área de Trabalho\Software da Allanda\run.vbs"""
    $Shortcut2.IconLocation = "c:\Users\marce\OneDrive\Área de Trabalho\Software da Allanda\icon.ico"
    $Shortcut2.WorkingDirectory = "c:\Users\marce\OneDrive\Área de Trabalho\Software da Allanda"
    $Shortcut2.Save()
} catch {}
