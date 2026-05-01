Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = "..\Cahier_des_Charges_SOUK v11.docx"
if (-not (Test-Path $docxPath)) {
    $docxPath = "..\SOUK_Cahier_Conception (2).docx"
}

$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object IO.StreamReader($stream)
$xml = [xml]$reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

$text = $xml.SelectNodes("//*[local-name()='t']") | ForEach-Object { $_."#text" }
$text -join "`n" | Out-File "cahier.txt" -Encoding UTF8
Write-Host "Extraction complete."
