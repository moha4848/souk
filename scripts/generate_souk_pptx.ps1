param(
    [string]$OutputPath = "presentation_soutenance_souk.pptx"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = (Resolve-Path ".").Path
$out = Join-Path $root $OutputPath
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("souk_pptx_" + [System.Guid]::NewGuid().ToString("N"))

function E([string]$text) {
    return [System.Security.SecurityElement]::Escape($text)
}

function Emu([double]$inches) {
    return [int64]($inches * 914400)
}

function Write-Utf8([string]$path, [string]$content) {
    $dir = Split-Path -Parent $path
    if (!(Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
    [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
}

function TextBox($id, $x, $y, $w, $h, $text, $size = 24, $color = "172018", [bool]$bold = $false, $fill = $null) {
    $b = if ($bold) { ' b="1"' } else { "" }
    $fillXml = if ($fill) {
        "<a:solidFill><a:srgbClr val=`"$fill`"/></a:solidFill><a:ln><a:solidFill><a:srgbClr val=`"D9D1C4`"/></a:solidFill></a:ln>"
    } else {
        "<a:noFill/><a:ln><a:noFill/></a:ln>"
    }
    $paras = @()
    foreach ($raw in ($text -split "`n")) {
        $line = $raw.TrimEnd()
        if ($line.StartsWith("- ")) {
            $line = $line.Substring(2)
            $paras += "<a:p><a:pPr marL=`"285750`" indent=`"-228600`"><a:buChar char=`"•`"/></a:pPr><a:r><a:rPr lang=`"fr-FR`" sz=`"$($size * 100)`"$b><a:solidFill><a:srgbClr val=`"$color`"/></a:solidFill></a:rPr><a:t>$(E $line)</a:t></a:r></a:p>"
        } else {
            $paras += "<a:p><a:r><a:rPr lang=`"fr-FR`" sz=`"$($size * 100)`"$b><a:solidFill><a:srgbClr val=`"$color`"/></a:solidFill></a:rPr><a:t>$(E $line)</a:t></a:r></a:p>"
        }
    }
    return @"
<p:sp>
  <p:nvSpPr><p:cNvPr id="$id" name="Text $id"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="$(Emu $x)" y="$(Emu $y)"/><a:ext cx="$(Emu $w)" cy="$(Emu $h)"/></a:xfrm>
    <a:prstGeom prst="roundRect"><a:avLst/></a:prstGeom>
    $fillXml
  </p:spPr>
  <p:txBody><a:bodyPr wrap="square" lIns="91440" tIns="91440" rIns="91440" bIns="91440"/><a:lstStyle/>$($paras -join '')</p:txBody>
</p:sp>
"@
}

function ImageBox($id, $rId, $x, $y, $w, $h) {
    return @"
<p:pic>
  <p:nvPicPr><p:cNvPr id="$id" name="Image $id"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>
  <p:blipFill><a:blip r:embed="$rId"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
  <p:spPr><a:xfrm><a:off x="$(Emu $x)" y="$(Emu $y)"/><a:ext cx="$(Emu $w)" cy="$(Emu $h)"/></a:xfrm><a:prstGeom prst="roundRect"><a:avLst/></a:prstGeom><a:ln><a:solidFill><a:srgbClr val="D9D1C4"/></a:solidFill></a:ln></p:spPr>
</p:pic>
"@
}

$slides = @(
    @{sec="1. Introduction"; title="SOUK"; subtitle="Marketplace SaaS marocaine"; body="Application web e-commerce pour aider les artisans, createurs et vendeurs marocains a creer une boutique en ligne, presenter leurs produits et recevoir des commandes."; img="docs/annexes/page_accueil.png"},
    @{sec="Plan"; title="Structure de la presentation"; body="- Introduction, contexte et problematique`n- Objectifs et fonctionnement du projet`n- Maquettes reelles avec analyse UX/UI`n- Technologies, analyse professionnelle et conclusion"},
    @{sec="1. Introduction"; title="Description generale"; body="- Marketplace multi-boutique`n- Solution SaaS prete a l'emploi`n- Projet adapte au commerce marocain`n- Parcours client, vendeur et administrateur"},
    @{sec="2. Problematique"; title="Contexte du besoin"; body="- Beaucoup de vendeurs marocains ont une offre riche mais peu digitalisee`n- Les clients recherchent des experiences rapides et fiables`n- La visibilite en ligne devient essentielle`n- Le besoin principal est de centraliser la vente"},
    @{sec="2. Problematique"; title="Probleme reel resolu"; body="Les vendeurs locaux ont besoin d'une solution unique pour transformer une activite dispersee en activite digitale organisee : boutique, catalogue, commande, communication et supervision."},
    @{sec="2. Problematique"; title="Importance actuelle"; body="- Digitalisation des petites activites`n- Confiance grace a une interface professionnelle`n- Developpement du commerce local marocain"},
    @{sec="3. Objectifs"; title="Objectif principal"; body="Developper une application web professionnelle qui permet aux vendeurs marocains de creer leur presence digitale, vendre leurs produits et gerer leur activite depuis un espace centralise."},
    @{sec="3. Objectifs"; title="Objectifs secondaires"; body="- Espaces client, vendeur et administrateur`n- Catalogue produit clair`n- Suivi des commandes et du stock`n- Communication client-vendeur`n- API REST maintenable et securisee"},
    @{sec="3. Objectifs"; title="Impact attendu"; body="- Vendeur : autonomie, organisation et visibilite`n- Client : parcours d'achat clair et rassurant`n- Marche local : valorisation du savoir-faire marocain"},
    @{sec="4. Fonctionnement"; title="Architecture generale"; body="Frontend React + Vite`nAPI REST Laravel 11`nBase de donnees MySQL / SQLite`n`nLe frontend affiche l'experience utilisateur. Le backend applique la logique metier et securise les operations."; img="docs/annexes/architecture.png"},
    @{sec="4. Fonctionnement"; title="Parcours utilisateur"; body="- Le client explore la marketplace`n- Il consulte un produit et passe commande`n- Le vendeur recoit et traite la commande`n- L'administrateur supervise les comptes et permissions"},
    @{sec="4. Fonctionnement"; title="Logique des fonctionnalites"; body="- Authentification JWT`n- Roles et permissions`n- Catalogue, panier et checkout`n- Commandes avec controle du stock`n- Chat, notifications et dashboard vendeur"},
    @{sec="4. Fonctionnement"; title="Modele de donnees"; body="La base de donnees relie les utilisateurs, vendeurs, produits, commandes, messages, notifications, roles et permissions."; img="docs/annexes/2_classes_officiel.png"; contain=$true},
    @{sec="5. Maquettes"; title="Maquettes et pages du site"; body="Les images suivantes sont des captures reelles du projet, stockees localement dans docs/annexes. Elles ne proviennent pas d'internet."},
    @{sec="5. Maquettes - Home"; title="Home / Accueil"; body="Description : page d'entree qui presente SOUK et son positionnement.`n`nUX/UI : style elegant, couleurs marocaines modernes, hierarchie claire.`n`nRole : creer la confiance et orienter vers l'exploration."; img="docs/annexes/page_accueil.png"},
    @{sec="5. Maquettes - Login client"; title="Login client"; body="Description : connexion au compte client.`n`nUX/UI : formulaire lisible, action principale claire.`n`nRole : securiser l'acces aux commandes, notifications et conversations."; img="docs/annexes/client_login.png"},
    @{sec="5. Maquettes - Login vendeur"; title="Login vendeur"; body="Description : authentification pour acceder a l'espace professionnel.`n`nUX/UI : separation claire du parcours vendeur.`n`nRole : ouvrir l'acces au dashboard et a la gestion commerciale."; img="docs/annexes/vendor_login.png"},
    @{sec="5. Maquettes - Marketplace"; title="Marketplace / Explore"; body="Description : decouverte des boutiques et produits.`n`nUX/UI : cartes, navigation visuelle et lecture rapide.`n`nRole : connecter clients et vendeurs, declencher l'achat."; img="docs/annexes/explore.png"},
    @{sec="5. Maquettes - Produit"; title="Page produit"; body="Description : presentation detaillee avant achat.`n`nUX/UI : visuel, description, prix et action d'achat.`n`nRole : transformer l'interet en intention de commande."; img="docs/annexes/page_produit.png"},
    @{sec="5. Maquettes - Dashboard"; title="Dashboard vendeur"; body="Description : espace de pilotage du vendeur.`n`nUX/UI : informations prioritaires visibles rapidement.`n`nRole : ameliorer l'autonomie et le suivi quotidien."; img="docs/annexes/dashboard_vendeur.png"},
    @{sec="5. Maquettes - Admin"; title="Admin Panel"; body="Description : supervision de la plateforme.`n`nUX/UI : interface orientee controle et statistiques.`n`nRole : assurer gouvernance, securite et qualite."; img="docs/annexes/admin_panel.png"},
    @{sec="6. Technologies"; title="Technologies utilisees"; body="- Frontend : React, Vite, React Router, Context API, Axios, CSS`n- Backend : Laravel 11, PHP, API REST, Eloquent ORM`n- Base de donnees : MySQL / SQLite`n- Outils : GitHub, VS Code, Postman, Figma, JWT, RBAC"},
    @{sec="7. Analyse professionnelle"; title="Points forts"; body="- Solution adaptee au marche marocain`n- Parcours complet client, vendeur et administrateur`n- Architecture claire et evolutive`n- Gestion des roles et permissions`n- Dashboard vendeur oriente productivite"},
    @{sec="7. Analyse professionnelle"; title="Innovations et valeur ajoutee"; body="- Approche SaaS prete a l'emploi`n- Experience locale valorisant le commerce marocain`n- Centralisation : boutique, produits, commandes, chat et administration"},
    @{sec="7. Analyse professionnelle"; title="Comparaison"; body="Reseaux sociaux : bons pour la visibilite, limites pour le suivi.`nSites e-commerce classiques : puissants mais souvent complexes.`nSOUK : solution specialisee, accessible et adaptee aux besoins locaux."},
    @{sec="8. Conclusion"; title="Resume du projet"; body="SOUK regroupe marketplace, boutiques vendeur, catalogue, commandes, chat, notifications, dashboard et administration dans une application web professionnelle."},
    @{sec="8. Conclusion"; title="Impact au Maroc"; body="- Digitalisation du commerce local`n- Valorisation des produits marocains`n- Nouvelles opportunites commerciales pour artisans et petits vendeurs"},
    @{sec="8. Conclusion"; title="Perspectives futures"; body="- Paiement en ligne et livraison par zone`n- Chat temps reel et application mobile`n- IA pour descriptions, recommandations et recherche intelligente`n- Analytics avances et optimisation des performances"}
)

try {
    New-Item -ItemType Directory -Path $tmp | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tmp "ppt\slides\_rels") -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tmp "ppt\media") -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tmp "ppt\_rels") -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tmp "_rels") -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tmp "ppt\theme") -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tmp "ppt\slideMasters\_rels") -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tmp "ppt\slideLayouts\_rels") -Force | Out-Null

    $contentOverrides = @()
    $presentationRels = @('<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>')

    $mediaIndex = 1
    for ($i = 0; $i -lt $slides.Count; $i++) {
        $n = $i + 1
        $s = $slides[$i]
        $shapes = @()
        $shapes += TextBox 10 0.45 0.25 4.8 0.32 $s.sec 11 "0F7A55" $true
        $shapes += TextBox 11 11.7 0.25 1.0 0.32 ("{0:00} / {1}" -f $n, $slides.Count) 10 "657166" $true
        if ($s.ContainsKey("subtitle")) {
            $shapes += TextBox 12 0.75 1.25 5.45 1.2 $s.title 40 "0F7A55" $true
            $shapes += TextBox 13 0.75 2.35 5.45 0.55 $s.subtitle 24 "C4942F" $true
            $shapes += TextBox 14 0.75 3.05 5.15 1.65 $s.body 18 "657166" $false
        } else {
            $shapes += TextBox 12 0.75 0.95 6.15 0.95 $s.title 32 "172018" $true
            $shapes += TextBox 13 0.75 2.0 5.95 3.9 $s.body 18 "657166" $false
        }

        $rels = @('<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>')
        if ($s.ContainsKey("img")) {
            $imgPath = Join-Path $root $s.img
            $ext = [System.IO.Path]::GetExtension($imgPath).ToLowerInvariant().TrimStart(".")
            $mediaName = "image$mediaIndex.$ext"
            Copy-Item -LiteralPath $imgPath -Destination (Join-Path $tmp "ppt\media\$mediaName")
            $rels += "<Relationship Id=`"rId2`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image`" Target=`"../media/$mediaName`"/>"
            if ($s.ContainsKey("contain")) {
                $shapes += ImageBox 20 "rId2" 7.0 1.25 5.45 4.75
            } else {
                $shapes += ImageBox 20 "rId2" 7.0 1.05 5.45 5.0
            }
            $mediaIndex++
        }

        $slideXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="FBF7EF"/></a:solidFill></p:bgPr></p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      $($shapes -join "`n")
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>
"@
        Write-Utf8 (Join-Path $tmp "ppt\slides\slide$n.xml") $slideXml
        Write-Utf8 (Join-Path $tmp "ppt\slides\_rels\slide$n.xml.rels") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Relationships xmlns=`"http://schemas.openxmlformats.org/package/2006/relationships`">$($rels -join '')</Relationships>"
        $presentationRels += "<Relationship Id=`"rId$($n + 1)`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide`" Target=`"slides/slide$n.xml`"/>"
        $contentOverrides += "<Override PartName=`"/ppt/slides/slide$n.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.presentationml.slide+xml`"/>"
    }

    $sldIds = for ($i = 0; $i -lt $slides.Count; $i++) {
        "<p:sldId id=`"$($i + 256)`" r:id=`"rId$($i + 2)`"/>"
    }

    Write-Utf8 (Join-Path $tmp "[Content_Types].xml") @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  $($contentOverrides -join "`n  ")
</Types>
"@

    Write-Utf8 (Join-Path $tmp "_rels\.rels") '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>'

    Write-Utf8 (Join-Path $tmp "ppt\presentation.xml") @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
  <p:sldIdLst>$($sldIds -join '')</p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="wide"/>
  <p:notesSz cx="6858000" cy="9144000"/>
  <p:defaultTextStyle/>
</p:presentation>
"@
    Write-Utf8 (Join-Path $tmp "ppt\_rels\presentation.xml.rels") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Relationships xmlns=`"http://schemas.openxmlformats.org/package/2006/relationships`">$($presentationRels -join '')</Relationships>"

    Write-Utf8 (Join-Path $tmp "ppt\slideMasters\slideMaster1.xml") @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
  <p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles>
</p:sldMaster>
"@
    Write-Utf8 (Join-Path $tmp "ppt\slideMasters\_rels\slideMaster1.xml.rels") '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>'
    Write-Utf8 (Join-Path $tmp "ppt\slideLayouts\slideLayout1.xml") '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>'
    Write-Utf8 (Join-Path $tmp "ppt\slideLayouts\_rels\slideLayout1.xml.rels") '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>'
    Write-Utf8 (Join-Path $tmp "ppt\theme\theme1.xml") '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="SOUK"><a:themeElements><a:clrScheme name="SOUK"><a:dk1><a:srgbClr val="172018"/></a:dk1><a:lt1><a:srgbClr val="FBF7EF"/></a:lt1><a:dk2><a:srgbClr val="0B503B"/></a:dk2><a:lt2><a:srgbClr val="E7F3EC"/></a:lt2><a:accent1><a:srgbClr val="0F7A55"/></a:accent1><a:accent2><a:srgbClr val="C4942F"/></a:accent2><a:accent3><a:srgbClr val="B66B3E"/></a:accent3><a:accent4><a:srgbClr val="657166"/></a:accent4><a:accent5><a:srgbClr val="FBF7EF"/></a:accent5><a:accent6><a:srgbClr val="D9D1C4"/></a:accent6><a:hlink><a:srgbClr val="0F7A55"/></a:hlink><a:folHlink><a:srgbClr val="C4942F"/></a:folHlink></a:clrScheme><a:fontScheme name="SOUK"><a:majorFont><a:latin typeface="Segoe UI"/></a:majorFont><a:minorFont><a:latin typeface="Segoe UI"/></a:minorFont></a:fontScheme><a:fmtScheme name="SOUK"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>'

    if (Test-Path -LiteralPath $out) { Remove-Item -LiteralPath $out -Force }
    $archive = [System.IO.Compression.ZipFile]::Open($out, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        Get-ChildItem -LiteralPath $tmp -Recurse -File | ForEach-Object {
            $relative = $_.FullName.Substring($tmp.Length).TrimStart('\', '/') -replace '\\', '/'
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $relative) | Out-Null
        }
    }
    finally {
        $archive.Dispose()
    }
    Write-Output $out
}
finally {
    if (Test-Path -LiteralPath $tmp) {
        Remove-Item -LiteralPath $tmp -Recurse -Force
    }
}
