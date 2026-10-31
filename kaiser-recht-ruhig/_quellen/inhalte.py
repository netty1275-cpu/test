"""Inhalte der Unterseiten. Quelle ist texte.md, Änderungen dort und hier gleichzeitig."""

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'


def ul(items):
    return '<ul class="ticks">' + "".join("<li>" + i + "</li>" for i in items) + "</ul>"


def steps(items, line="p"):
    out = '<ol class="steps steps--' + line + '">'
    for title, text in items:
        out += "<li><b>" + title + "</b>" + ("<span>" + text + "</span>" if text else "") + "</li>"
    return out + "</ol>"


def bridge(text, href, label):
    return ('<aside class="bridge"><p>' + text + '</p><a class="btn btn--terra" href="' + href + '">'
            + label + " " + ARROW + "</a></aside>")


def p(*texts):
    return "".join("<p>" + t + "</p>" for t in texts)


PAGES = [
    # ------------------------------------------------------------------ Verkehrsunfall
    dict(
        file="verkehrsunfall.html", crumb="Verkehrsunfall", nav="index.html#rechtsgebiete",
        title="Anwalt Verkehrsunfall Berlin-Tempelhof · Kaiser & Kaiser",
        desc="Unfall ohne eigene Schuld? Wir regulieren Ihren Schaden mit der gegnerischen Versicherung. Kanzlei am Mariendorfer Damm 73. Rufen Sie uns an.",
        h1="Anwalt nach dem Verkehrsunfall in Berlin-Mariendorf und Tempelhof",
        intro=["Nach einem Unfall beginnt der Ärger oft erst: Werkstatt, Gutachter, die Versicherung des Unfallgegners und manchmal die Polizei. Wir übernehmen die Korrespondenz und setzen Ihre Ansprüche durch.",
               "Holen Sie sich Rat, bevor Sie gegenüber der Versicherung, dem Unfallgegner oder der Polizei etwas erklären."],
        sections=[
            dict(h2="Schadens&shy;regulierung nach dem Verkehrsunfall", html=ul([
                "Wir melden Ihre Ansprüche bei der Versicherung des Unfallgegners an.",
                "Wir fordern Reparaturkosten oder den Wiederbeschaffungswert, die Kosten für den Gutachter und einen Mietwagen oder Nutzungsausfall.",
                "Bei Verletzungen fordern wir Schmerzensgeld und den Ersatz weiterer Schäden, etwa Verdienstausfall.",
                "Kürzt die Versicherung, verhandeln wir. Wenn nötig, klagen wir."])),
            dict(h2="Unfall ohne eigene Schuld: Wer zahlt den Anwalt?", id="wer-zahlt", html=p(
                "Wenn Sie den Unfall nicht verursacht haben, muss in der Regel die Haftpflichtversicherung des Unfallgegners auch Ihre Anwaltskosten übernehmen. Sie gehören zum Schaden.",
                "Haben Sie eine Mitschuld, zahlt die Versicherung einen Teil. Den Rest übernimmt oft Ihre Rechtsschutzversicherung. Wir klären das vor Beginn mit Ihnen.")),
            dict(h2="Was Sie direkt nach dem Unfall tun sollten", id="nach-dem-unfall", html=steps([
                ("Unfallstelle sichern", "und Verletzte versorgen."),
                ("Polizei rufen", "bei Verletzten, Streit über den Hergang oder Verdacht auf Alkohol."),
                ("Daten notieren", "Namen, Anschrift, Kennzeichen und Versicherung des Unfallgegners, außerdem Zeugen."),
                ("Fotos machen", "von der Unfallstelle und den Schäden."),
                ("Nichts unterschreiben", "vor allem kein Schuldanerkenntnis."),
                ("Uns anrufen", "bevor Sie mit der gegnerischen Versicherung sprechen.")])),
            dict(h2="Unfall online melden", id="online", html=p(
                "Sie müssen nicht in die Kanzlei kommen. Füllen Sie den Fragebogen für Anspruchsteller aus, unterschreiben Sie die Vollmacht und schicken Sie beides an uns. Sie erhalten dann eine Eingangsbestätigung mit einer ersten rechtlichen Einschätzung Ihrer Forderung.")
                + '<p><a class="btn btn--line" href="mailto:kanzlei@kaiser-recht.de?subject=Fragebogen%20Verkehrsunfall">Fragebogen per E-Mail anfordern</a></p>'),
        ],
        faq_h2="Häufige Fragen zum Verkehrsunfall",
        faq=[
            ("Muss ich die Werkstatt oder den Gutachter nehmen, den die Versicherung vorschlägt?", "Nein. Als Geschädigter dürfen Sie in der Regel einen unabhängigen Gutachter selbst beauftragen. Bei Bagatellschäden reicht oft ein Kostenvoranschlag."),
            ("Bekomme ich Schmerzensgeld?", "Wenn Sie beim Unfall verletzt wurden, haben Sie in der Regel Anspruch auf Schmerzensgeld. Wie hoch es ausfällt, hängt von der Verletzung und ihren Folgen ab."),
            ("Wie lange habe ich Zeit, meine Ansprüche geltend zu machen?", "Ansprüche auf Schadensersatz und Schmerzensgeld verjähren in der Regel nach drei Jahren, gerechnet ab dem Ende des Unfalljahres. Warten Sie trotzdem nicht: Beweise sind kurz nach dem Unfall am leichtesten zu sichern."),
            ("Was ist, wenn mir eine Mitschuld vorgeworfen wird?", "Dann wird der Schaden nach Quoten verteilt. Wir prüfen den Hergang und vertreten Sie, wenn Ihnen auch ein Bußgeld oder ein Strafverfahren droht."),
        ],
    ),
    # ------------------------------------------------------------------ Bußgeld und Strafrecht
    dict(
        file="bussgeld-strafrecht.html", crumb="Bußgeld und Strafrecht", nav="index.html#rechtsgebiete",
        title="Bußgeld und Strafverteidigung Berlin-Mariendorf · Kaiser",
        desc="Bußgeldbescheid, Fahrverbot oder Strafverfahren? Wir prüfen Ihren Fall und verteidigen Sie. Kanzlei am Mariendorfer Damm 73. Rufen Sie uns an.",
        h1="Bußgeldbescheid, Fahrverbot, Strafverfahren: Verteidigung in Berlin",
        intro=["Ein Anhörungsbogen, ein Bußgeldbescheid oder eine Vorladung der Polizei. Sagen Sie nichts zur Sache, bevor Sie mit uns gesprochen haben.",
               "Wir sehen die Akte ein und sagen Ihnen, welche Chancen Sie haben."],
        sections=[
            dict(h2="Bußgeldbescheid prüfen lassen", id="bussgeld", html=p(
                "Manche Bußgeldbescheide halten einer Prüfung nicht stand: Die Messung war fehlerhaft, das Foto zeigt nicht eindeutig den Fahrer, oder eine Frist ist abgelaufen. Wir beantragen Akteneinsicht und prüfen den Bescheid, bevor Sie zahlen oder Einspruch einlegen.")),
            dict(h2="Einspruch: zwei Wochen Zeit", id="frist", html=p(
                "Gegen einen Bußgeldbescheid können Sie innerhalb von zwei Wochen nach Zustellung Einspruch einlegen. Ist die Frist vorbei, wird der Bescheid rechtskräftig.",
                "Rufen Sie uns deshalb an, sobald der Bescheid im Briefkasten liegt.")),
            dict(h2="Fahrverbot und Führerschein", id="fahrverbot", html=p(
                "Wer beruflich auf das Auto angewiesen ist, für den ist ein Fahrverbot oft schlimmer als das Bußgeld. Wir prüfen, ob sich das Fahrverbot vermeiden oder der Zeitpunkt günstig legen lässt.")),
            dict(h2="Strafverteidigung und Verkehrs&shy;strafsachen", id="strafrecht", html=p(
                "Wir verteidigen Sie im Ermittlungsverfahren und vor Gericht. Ein Schwerpunkt sind Verkehrsstraftaten wie Unfallflucht, Trunkenheit im Verkehr oder Gefährdung des Straßenverkehrs.")),
        ],
        faq_h2="Häufige Fragen zu Bußgeld und Strafverfahren",
        faq=[
            ("Muss ich den Anhörungsbogen ausfüllen?", "Angaben zu Ihrer Person müssen Sie machen. Zur Sache selbst müssen Sie sich nicht äußern. Sprechen Sie vorher mit uns."),
            ("Lohnt sich ein Anwalt bei einem Bußgeld?", "Das hängt von den Folgen ab. Bei Punkten in Flensburg oder einem drohenden Fahrverbot lohnt sich die Prüfung fast immer. Eine Rechtsschutzversicherung mit Verkehrsrechtsschutz übernimmt die Kosten in der Regel."),
            ("Ich habe eine Vorladung der Polizei bekommen. Muss ich hin?", "Einer Vorladung als Beschuldigter bei der Polizei müssen Sie nicht folgen. Rufen Sie uns an, wir beantragen Akteneinsicht."),
        ],
    ),
    # ------------------------------------------------------------------ Familienrecht
    dict(
        file="familienrecht.html", crumb="Familienrecht", nav="index.html#rechtsgebiete",
        title="Anwalt Familienrecht Berlin-Tempelhof · Scheidung · Kaiser",
        desc="Trennung, Scheidung, Unterhalt, Umgang mit den Kindern. Rechtsanwälte und Mediation unter einem Dach, am Mariendorfer Damm 73. Rufen Sie uns an.",
        h1="Familienrecht in Berlin-Mariendorf: Trennung und Scheidung",
        intro=["Eine Trennung verändert vieles auf einmal: Wohnung, Geld, den Alltag der Kinder. Wir beraten Sie zu allen Fragen und vertreten Sie vor dem Familiengericht.",
               "Wenn Sie und Ihr Partner sich lieber selbst einigen wollen, ist eine Mediation bei uns möglich."],
        sections=[
            dict(h2="Wobei wir Sie beraten und vertreten", id="themen", html=ul([
                "Trennung und Scheidung", "Unterhalt für Kinder und Ehegatten", "Umgangsrecht und Sorgerecht",
                "Aufteilung von Vermögen, Wohnung und Hausrat", "Scheidungsfolgenvereinbarung"])),
            dict(h2="Sie bleiben Eltern", id="kinder", html=p(
                "Auch wenn Sie als Paar auseinandergehen: Eltern bleiben Sie ein Leben lang. Gerade beim Umgang und beim Sorgerecht hilft es den Kindern, wenn die Eltern eine Regelung finden, die beide tragen.")
                + bridge("Dafür eignet sich eine Mediation oft besser als ein Gerichtsverfahren.", "mediation.html", "Mediation bei Trennung")),
            dict(h2="Wie eine Scheidung abläuft", id="ablauf", html=steps([
                ("Trennungsjahr", "In der Regel müssen Sie ein Jahr getrennt leben, bevor die Ehe geschieden werden kann."),
                ("Scheidungsantrag", "Ein Anwalt reicht den Antrag beim Familiengericht ein."),
                ("Folgesachen", "Unterhalt, Vermögen, Wohnung und Kinder werden geregelt, im besten Fall vorab in einer Vereinbarung."),
                ("Termin beim Familiengericht", "Das Gericht spricht die Scheidung aus.")])),
        ],
        faq_h2="Häufige Fragen zur Scheidung",
        faq=[
            ("Was kostet eine Scheidung?", "Die Kosten richten sich nach dem Einkommen beider Ehepartner und danach, was geregelt werden muss. Wir beraten Sie vorher kostenfrei über die Gebühren und darüber, ob Sie Verfahrenskostenhilfe bekommen können."),
            ("Kann ich mich ohne Anwalt scheiden lassen?", "Den Scheidungsantrag muss ein Anwalt stellen. Der andere Ehepartner braucht keinen eigenen Anwalt, wenn er nur zustimmt und keine eigenen Anträge stellt."),
            ("Was ist besser, Anwalt oder Mediation?", "Das hängt davon ab, ob Sie noch miteinander reden können. Bei uns ist beides möglich. Wir beraten Sie, welcher Weg zu Ihrer Lage passt."),
        ],
    ),
    # ------------------------------------------------------------------ Arbeitsrecht
    dict(
        file="arbeitsrecht.html", crumb="Arbeitsrecht", nav="index.html#rechtsgebiete",
        title="Anwalt Arbeitsrecht Berlin-Tempelhof · Kündigung · Kaiser",
        desc="Kündigung erhalten? Sie haben drei Wochen für die Klage. Wir beraten Arbeitnehmer und Arbeitgeber in Berlin-Mariendorf. Rufen Sie uns an.",
        h1="Arbeitsrecht in Berlin-Mariendorf: Kündigung erhalten?",
        intro=["Nach einer Kündigung zählt jeder Tag. Wir prüfen die Kündigung, sagen Ihnen, ob sich eine Klage lohnt, und verhandeln über eine Abfindung.",
               "Wir vertreten Arbeitnehmer und Arbeitgeber und kennen deshalb beide Seiten."],
        sections=[
            dict(h2="Drei Wochen Zeit für die Klage", id="frist", html=p(
                "Wer sich gegen eine Kündigung wehren will, muss innerhalb von drei Wochen nach Zugang der Kündigung Klage beim Arbeitsgericht erheben. Verpassen Sie die Frist, gilt die Kündigung in aller Regel als wirksam.",
                "Melden Sie sich außerdem spätestens drei Tage nach Zugang der Kündigung bei der Agentur für Arbeit arbeitssuchend.")),
            dict(h2="Wobei wir Arbeitnehmer und Arbeitgeber beraten", id="themen", html=ul([
                "Kündigung und Kündigungsschutzklage", "Abfindung und Aufhebungsvertrag", "Abmahnung", "Arbeitszeugnis", "Lohn, Urlaub und Überstunden"])),
            dict(h2="Wenn es im Team nicht mehr geht", id="mediation", html=bridge(
                "Bei Mobbing oder festgefahrenen Konflikten unter Kollegen hilft oft kein Urteil. Claudia Kaiser bietet Mediation in Betrieben und Unternehmen an.", "mediation.html", "Mediation im Betrieb")),
        ],
        faq_h2="Häufige Fragen zum Arbeitsrecht",
        faq=[
            ("Habe ich Anspruch auf eine Abfindung?", "Einen gesetzlichen Anspruch gibt es nur in wenigen Fällen. Abfindungen entstehen meist durch Verhandlung oder im Vergleich vor dem Arbeitsgericht."),
            ("Soll ich einen Aufhebungsvertrag unterschreiben?", "Unterschreiben Sie nichts sofort. Ein Aufhebungsvertrag kann zu einer Sperrzeit beim Arbeitslosengeld führen. Lassen Sie ihn vorher prüfen."),
            ("Wer zahlt den Anwalt vor dem Arbeitsgericht?", "In der ersten Instanz trägt jede Seite ihre Anwaltskosten selbst, auch wenn sie gewinnt. Eine Rechtsschutzversicherung übernimmt die Kosten in der Regel."),
        ],
    ),
    # ------------------------------------------------------------------ Mietrecht
    dict(
        file="mietrecht.html", crumb="Mietrecht", nav="index.html#rechtsgebiete",
        title="Anwalt Mietrecht Berlin-Tempelhof und Mariendorf · Kaiser",
        desc="Eigenbedarf, Mieterhöhung, Nebenkosten, Kündigung. Wir beraten Mieter und Vermieter in Berlin. Kanzlei am Mariendorfer Damm 73. Rufen Sie uns an.",
        h1="Mietrecht in Berlin-Tempelhof und Mariendorf",
        intro=["Wir vertreten Mieter und Vermieter. Weil wir beide Seiten kennen, schätzen wir realistisch ein, wie ein Streit ausgehen kann, und suchen den Weg, der Sie am wenigsten kostet."],
        sections=[
            dict(h2="Wobei wir Sie im Mietrecht beraten", id="themen", html=ul([
                "Kündigung wegen Eigenbedarf", "Mieterhöhung und Mietpreisbremse", "Nebenkostenabrechnung",
                "Mängel und Mietminderung", "Kündigung und Räumung", "Kaution"])),
            dict(h2="Streit mit Nachbarn oder Mitmietern", id="nachbarn", html=bridge(
                "Lärm, Treppenhaus, Hof: Streit im Haus belastet jeden Tag. Bevor Sie klagen, kann eine Mediation helfen, wieder miteinander auszukommen.", "mediation.html", "Mediation bei Nachbarschaftsstreit")),
        ],
        faq_h2="Häufige Fragen zum Mietrecht",
        faq=[
            ("Mein Vermieter hat wegen Eigenbedarf gekündigt. Muss ich ausziehen?", "Nicht unbedingt. Die Kündigung muss den Bedarf konkret begründen, und in bestimmten Härtefällen können Sie widersprechen. Lassen Sie die Kündigung prüfen, bevor Sie eine neue Wohnung suchen."),
            ("Wie oft darf die Miete erhöht werden?", "Eine Erhöhung bis zur ortsüblichen Vergleichsmiete ist frühestens 15 Monate nach Einzug oder nach der letzten Erhöhung möglich. In Berlin darf die Miete dabei innerhalb von drei Jahren um höchstens 15 Prozent steigen."),
            ("Wie lange kann ich die Nebenkostenabrechnung prüfen?", "Einwände gegen die Abrechnung müssen Sie innerhalb von zwölf Monaten nach Zugang erheben."),
        ],
    ),
    # ------------------------------------------------------------------ Baurecht
    dict(
        file="baurecht.html", crumb="Baurecht", nav="index.html#rechtsgebiete",
        title="Anwalt Baurecht Berlin · Bauherren und Bauunternehmen · Kaiser",
        desc="Baumängel, Gewährleistung, offene Rechnungen. Wir beraten private Bauherren und Bauunternehmen in Berlin. Rufen Sie uns an.",
        h1="Baurecht in Berlin: für Bauherren und Bauunternehmen",
        intro=["Wir vertreten private Bauherren ebenso wie Bauunternehmen. Wir prüfen Verträge, setzen Mängelrechte durch und fordern offene Rechnungen ein, außergerichtlich oder vor Gericht."],
        sections=[
            dict(h2="Wobei wir Sie im Baurecht beraten", id="themen", html=ul([
                "Bauverträge und Architektenverträge prüfen", "Baumängel und Gewährleistung", "Abnahme",
                "Offene Werklohnforderungen", "Bauzeit und Verzug"])),
        ],
        faq_h2="Häufige Fragen zum Baurecht",
        faq=[
            ("Wann verjähren Ansprüche wegen Baumängeln?", "Bei Bauwerken verjähren die Mängelansprüche in der Regel fünf Jahre nach der Abnahme."),
            ("Was sollte ich bei der Abnahme beachten?", "Mit der Abnahme beginnt die Verjährung, und die Beweislast für Mängel geht in der Regel auf den Bauherrn über. Halten Sie alle bekannten Mängel im Abnahmeprotokoll fest."),
        ],
    ),
    # ------------------------------------------------------------------ Mediation
    dict(
        file="mediation.html", crumb="Mediation", nav="mediation.html", line="t",
        ld_extra=[{
            "@context": "https://schema.org", "@type": "VideoObject",
            "name": "Mediation in 60 Sekunden",
            "description": "Kurzes Erklärvideo ohne Ton: was Mediation ist, was sie bringt und wie sie in fünf Schritten abläuft. Praxis für Mediation von Claudia Kaiser in Berlin-Mariendorf.",
            "thumbnailUrl": "https://www.kaiser-recht.de/assets/img/mediation-poster.jpg",
            "contentUrl": "https://www.kaiser-recht.de/assets/video/mediation.mp4",
            "uploadDate": "2026-10-30", "duration": "PT1M", "inLanguage": "de",
            "publisher": {"@id": "https://www.kaiser-recht.de/#kanzlei"},
        }],
        title="Mediation Berlin-Tempelhof · Trennung, Familie, Erbe · Kaiser",
        desc="Mediation bei Trennung, Erbstreit, Nachbarn und Konflikten im Betrieb. Claudia Kaiser, Rechtsanwältin und Master of Mediation, Berlin-Mariendorf.",
        h1="Mediation in Berlin-Mariendorf",
        intro=["Ich bin Claudia Kaiser, Rechtsanwältin und Mediatorin. In einer Mediation finden Sie mit der anderen Seite eine Lösung, die Sie selbst gestalten.",
               "Die Entscheidung bleibt bei Ihnen und wird nicht in die Hände eines Gerichts gelegt."],
        hero_buttons='<div class="actions"><a class="btn btn--terra" href="#rueckruf">Informationsgespräch vereinbaren</a><a class="btn btn--line" href="tel:+49306612254">030 661 22 54 anrufen</a></div>',
        sections=[
            dict(h2="Was ist Mediation?", id="was", html=p(
                "Mediation ist ein vertrauliches Verfahren, um Konflikte außerhalb des Gerichts zu lösen. Ich begleite Sie als neutrale Dritte. Ich entscheide nichts und ergreife für niemanden Partei. Ich sorge dafür, dass ein Gespräch wieder möglich wird, auch wenn Sie selbst nicht mehr miteinander reden können.",
                "Das Gesetz kennt nur feste Antworten. In der Mediation finden Sie eine Lösung, die zu Ihrem Fall passt. Am Ende steht eine Vereinbarung, die Sie selbst schließen.")),
            dict(h2="Mediation in 60 Sekunden", id="video", html=
                '<figure class="video"><video controls preload="none" playsinline poster="assets/img/mediation-poster.jpg" width="1920" height="1080" aria-describedby="video-text">'
                '<source src="assets/video/mediation.mp4" type="video/mp4">'
                '<a href="assets/video/mediation.mp4">Video herunterladen</a></video>'
                '<figcaption>Das Video hat keinen Ton. Alle Aussagen stehen als Text im Bild.</figcaption></figure>'
                '<details class="transcript" id="video-text"><summary>Textfassung des Videos</summary><div>' + p(
                "Wenn Reden nicht mehr geht: bei Trennung, Erbe, Nachbarn oder unter Kollegen.",
                "Bei Kaiser &amp; Kaiser gibt es zwei Wege. Recht bekommen: vor Gericht. Oder eine Lösung finden: in der Mediation.",
                "Eine neutrale Mediatorin bringt beide Seiten an einen Tisch. Sie entscheiden selbst, nicht ein Gericht.",
                "Was Sie davon haben: Das Gespräch ist vertraulich. Sie behalten die Entscheidung. Und Sie finden eine Lösung, die zu Ihrem Fall passt, nicht nur eine Antwort nach Schema.",
                "So läuft es ab, in fünf Schritten: Informationsgespräch, Themen sammeln, Interessen klären, Lösungen entwickeln, Vereinbarung.",
                "Praxis für Mediation in Berlin-Mariendorf. Claudia Kaiser, Rechtsanwältin und Master of Mediation. Informationsgespräch unter 030 661 22 54.")
                + '</div></details>'),
            dict(h2="Wann Mediation hilft", id="wann", html=p(
                "Sie müssen nicht warten, bis es eskaliert. Gerade alltägliche Konflikte in der Familie, im Beruf oder mit Nachbarn belasten auf Dauer.")
                + '<p class="pull">Oft fällt irgendwann der Satz „Mit dem kann man nicht reden“. Dann ist Mediation einen Versuch wert.</p>'),
            dict(h2="Wobei ich Sie begleite", id="themen", html=
                '<div class="groups">'
                '<div><h3>Familienmediation</h3>' + ul(["Trennung und Scheidung", "Umgang und Sorgerecht", "Konflikte zwischen den Generationen", "Erbauseinandersetzungen und zerstrittene Erbengemeinschaften"]) + '</div>'
                '<div><h3>Nachbarschaft</h3>' + ul(["Streit mit Nachbarn und im Mietshaus"]) + '</div>'
                '<div><h3>Betriebe und Unternehmen</h3>' + ul(["Mobbing", "Kündigung und andere Konflikte am Arbeitsplatz"]) + '</div>'
                '<div><h3>Schule</h3>' + ul(["Vermittlung bei Konflikten in der Schule", "Moderation von Elternabenden und Schulkonferenzen"]) + '</div>'
                '<div><h3>Moderation</h3>' + ul(["Moderation von Sitzungen und Konferenzen"]) + '</div>'
                '</div>'),
            dict(h2="Der erste Schritt", id="ablauf", html=p(
                "Den ersten Schritt geht niemand gern, und schon gar nicht allein. Ich kann als neutrale Dritte die andere Seite zu einem ersten gemeinsamen Gespräch einladen.")
                + steps([
                    ("Informationsgespräch", "Wir klären, ob beide Seiten bereit sind und was geklärt werden soll."),
                    ("Themen sammeln", "Alle Punkte, die Sie regeln wollen, kommen auf den Tisch."),
                    ("Interessen klären", "Hinter jeder Forderung steht ein Anliegen. Darum geht es hier."),
                    ("Lösungen entwickeln", "Sie erarbeiten gemeinsam Möglichkeiten und wägen sie ab."),
                    ("Vereinbarung", "Was Sie beschlossen haben, wird schriftlich festgehalten.")], line="t")),
            dict(h2="Mediatorin mit juristischem Wissen", id="person", html=p(
                "Als Rechtsanwältin weiß ich, welche rechtlichen Folgen eine Vereinbarung hat. In der Mediation bin ich aber nicht Ihre Anwältin, sondern neutral für beide Seiten. Ich empfehle Ihnen, die fertige Vereinbarung vor der Unterschrift von einer eigenen Anwältin oder einem eigenen Anwalt prüfen zu lassen.")
                + ul(["Rechtsanwältin seit 1985", "Hochschulabschluss Master of Mediation", "Ausbildung zur Schulmediatorin und zum Personal Coach"])),
        ],
        faq_h2="Häufige Fragen zur Mediation",
        faq=[
            ("Wie lange dauert eine Mediation?", "Das hängt davon ab, wie viele Themen Sie klären wollen und wie verhärtet der Konflikt ist. Wir besprechen das im Informationsgespräch."),
            ("Ist die Vereinbarung verbindlich?", "Die Vereinbarung ist ein Vertrag zwischen Ihnen. Für manche Regelungen, etwa zu Grundstücken oder für die Vollstreckbarkeit, ist eine notarielle Beurkundung oder ein gerichtlicher Vergleich nötig."),
            ("Was ist, wenn die andere Seite nicht will?", "Mediation ist freiwillig. Ich kann die andere Seite einladen. Wenn sie nicht kommt, beraten wir Sie als Anwälte über die anderen Wege."),
        ],
    ),
    # ------------------------------------------------------------------ Kanzlei
    dict(
        file="kanzlei.html", crumb="Kanzlei", nav="kanzlei.html",
        title="Andreas und Claudia Kaiser · Rechtsanwälte in Berlin seit 1984",
        desc="Rechtsanwaltskanzlei Kaiser & Kaiser am Mariendorfer Damm 73 in Berlin-Mariendorf: zwei Anwälte, seit 1984, mit eigener Praxis für Mediation.",
        h1="Kaiser & Kaiser, Rechtsanwälte in Berlin-Mariendorf",
        intro=["Wir führen die Kanzlei seit 1984 am Mariendorfer Damm. Uns ist wichtig, dass Sie uns vertrauen können, dass wir unser Fach kennen und dass wir uns um Ihr Anliegen persönlich kümmern."],
        sections=[
            dict(h2="Andreas Kaiser, Rechtsanwalt", id="andreas-kaiser", html=
                '<div class="person"><div class="photo photo--s"><img src="assets/img/andreas-kaiser.jpg" width="368" height="492" alt="Andreas Kaiser"></div><div>' + p(
                "Andreas Kaiser hat Rechtswissenschaften an der Freien Universität Berlin studiert und sein Referendariat am Kammergericht absolviert. Im Dezember 1983 wurde er als Rechtsanwalt zugelassen.",
                "Seit 1984 ist er selbstständig und Inhaber der Kanzlei Kaiser & Kaiser. Er ist Mitglied der Rechtsanwaltskammer Berlin.") + '</div></div>'),
            dict(h2="Claudia Kaiser, Rechtsanwältin und Master of Mediation", id="claudia-kaiser", html=
                '<div class="person"><div class="photo photo--s"><img src="assets/img/claudia-kaiser.jpg" width="368" height="492" alt="Claudia Kaiser"></div><div>' + p(
                "Claudia Kaiser hat Rechtswissenschaften an der Universität Saarbrücken und der Freien Universität Berlin studiert und ihr Referendariat am Kammergericht absolviert. Seit 1985 ist sie als Rechtsanwältin zugelassen.",
                "Berufsbegleitend hat sie den Hochschulabschluss Master of Mediation erworben und sich zur Schulmediatorin und zum Personal Coach ausbilden lassen. Sie ist Mitglied der Rechtsanwaltskammer Berlin.")
                + '<a class="btn btn--terra" href="mediation.html">Zur Praxis für Mediation ' + ARROW + '</a></div></div>'),
            dict(h2="Vor welchen Gerichten wir Sie vertreten", id="gerichte", html=p(
                "Wir vertreten Sie vor allen deutschen Amts-, Land- und Oberlandesgerichten, vor Arbeits-, Sozial- und Verwaltungsgerichten.")),
        ],
    ),
    # ------------------------------------------------------------------ Kontakt
    dict(
        file="kontakt.html", crumb="Kontakt und Anfahrt", nav="kontakt.html",
        title="Kontakt · Rechtsanwälte Kaiser · Mariendorfer Damm 73",
        desc="Kanzlei Kaiser & Kaiser, Mariendorfer Damm 73, 12109 Berlin. U6 Westphalweg. Mo bis Do 9 bis 18 Uhr, Fr 9 bis 13 Uhr. Telefon 030 661 22 54.",
        h1="Kontakt und Anfahrt",
        intro=["Rufen Sie uns an, schreiben Sie uns oder bitten Sie um einen Rückruf. Für ein persönliches Gespräch in der Kanzlei vereinbaren Sie bitte vorher einen Termin, damit Sie nicht warten müssen."],
        sections=[
            dict(h2="So finden Sie uns", id="anfahrt", html=p(
                "Mariendorfer Damm 73, 12109 Berlin-Mariendorf. Die Kanzlei liegt im Ärztehaus an der Ecke Westphalweg und Kaiserstraße.")
                + '<div class="sign"><div class="bar"><b>Westphalweg</b><span>Kanzlei Kaiser</span></div><ul>'
                  '<li><span>U-Bahn U6, Bahnhof Westphalweg</span><b>20 Meter</b></li>'
                  '<li><span>Bus 282, Haltestelle Westphalweg</span><b>10 Meter</b></li>'
                  '<li><span>Montag bis Donnerstag</span><b>9 bis 18 Uhr</b></li>'
                  '<li><span>Freitag</span><b>9 bis 13 Uhr</b></li></ul></div>'
                + '<p style="margin-top:1.4rem"><a class="btn btn--line" href="https://www.google.com/maps/search/?api=1&amp;query=Mariendorfer+Damm+73,+12109+Berlin" rel="noopener">Route in Google Maps öffnen</a></p>'),
        ],
    ),
    # ------------------------------------------------------------------ Impressum
    dict(
        file="impressum.html", crumb="Impressum", no_contact=True,
        title="Impressum · Kaiser & Kaiser Rechtsanwälte",
        desc="Impressum der Rechtsanwaltskanzlei Kaiser & Kaiser, Mariendorfer Damm 73, 12109 Berlin.",
        h1="Impressum",
        intro=["Informationen gemäß den Anforderungen des Digitale-Dienste-Gesetzes (DDG)."],
        hero_buttons="",
        sections=[
            dict(h2="Anbieter", id="anbieter", html=p(
                "Andreas Kaiser, Rechtsanwalt<br>Claudia Kaiser, Rechtsanwältin<br>Mariendorfer Damm 73<br>12109 Berlin",
                "Telefon 030 661 22 54 und 030 661 22 55<br>Telefax 030 661 15 50<br>E-Mail <a href=\"mailto:kanzlei@kaiser-recht.de\">kanzlei@kaiser-recht.de</a>",
                "Steuernummer: Finanzamt Neukölln-Süd 16/371/60329",
                "Verantwortlich nach § 18 Abs. 2 MStV: Andreas Kaiser und Claudia Kaiser, Anschrift wie oben.")),
            dict(h2="Berufsrechtliche Angaben", id="beruf", html=p(
                "Die gesetzlichen Berufsbezeichnungen „Rechtsanwalt“ und „Rechtsanwältin“ wurden in der Bundesrepublik Deutschland im Bundesland Berlin verliehen.",
                "Zuständige Aufsichtsbehörde: Rechtsanwaltskammer Berlin, Littenstraße 9, 10179 Berlin, Telefon 030 306931 0, <a href=\"https://www.rak-berlin.de\" rel=\"noopener\">www.rak-berlin.de</a>",
                "Berufsrechtliche Regelungen: Bundesrechtsanwaltsordnung (BRAO), Berufsordnung für Rechtsanwälte (BORA), Berufsregeln der Rechtsanwälte der Europäischen Union (CCBE), Fachanwaltsordnung (FAO), Rechtsanwaltsvergütungsgesetz (RVG). Die Regelungen können bei der Bundesrechtsanwaltskammer unter <a href=\"https://www.brak.de\" rel=\"noopener\">www.brak.de</a> eingesehen werden.")),
            dict(h2="Berufshaftpflicht&shy;versicherung", id="versicherung", html=p(
                "Allianz Versicherungs-AG, 10900 Berlin",
                "Geltungsbereich: berufliche Tätigkeit in Deutschland, in den Mitgliedsländern der EU, in der Türkei und in den Staaten auf dem Gebiet der ehemaligen Sowjetunion, einschließlich Litauen, Estland und Lettland.")),
        ],
    ),
    # ------------------------------------------------------------------ Datenschutz
    dict(
        file="datenschutz.html", crumb="Datenschutz", no_contact=True, noindex=True,
        title="Datenschutzerklärung · Kaiser & Kaiser Rechtsanwälte",
        desc="Datenschutzerklärung der Rechtsanwaltskanzlei Kaiser & Kaiser.",
        h1="Datenschutzerklärung",
        intro=["Entwurf, Stand 30. Oktober 2026. Wird vor der Veröffentlichung von der Kanzlei geprüft.",
               "Diese Seite setzt keine Cookies, nutzt keine Statistik- oder Werbedienste und lädt keine Inhalte von fremden Servern."],
        hero_buttons="",
        sections=[
            dict(h2="Verantwortliche", id="verantwortliche", html=p(
                "Andreas Kaiser und Claudia Kaiser, Rechtsanwälte<br>Mariendorfer Damm 73, 12109 Berlin<br>Telefon 030 661 22 54<br>E-Mail <a href=\"mailto:kanzlei@kaiser-recht.de\">kanzlei@kaiser-recht.de</a>")),
            dict(h2="Aufruf der Website", id="server", html=p(
                "Wenn Sie diese Website aufrufen, verarbeitet der Server unseres Hosting-Anbieters automatisch Daten, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Seite, von der Sie kommen, sowie Browser und Betriebssystem. Das ist nötig, um die Seite auszuliefern und die Sicherheit des Servers zu gewährleisten.",
                "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist der sichere und störungsfreie Betrieb der Website.",
                "Hosting-Anbieter ist die IONOS SE, Elgendorfer Straße 57, 56410 Montabaur. Mit IONOS besteht ein Vertrag zur Auftragsverarbeitung. Die Protokolldaten werden vom Anbieter nach kurzer Zeit gelöscht.")),
            dict(h2="Keine Cookies, keine Analyse", id="cookies", html=p(
                "Wir setzen keine Cookies und speichern nichts auf Ihrem Gerät. Wir nutzen keine Werkzeuge zur Reichweitenmessung, keine Werbedienste und keine Social-Media-Plugins.",
                "Die Schriften der Website liegen auf unserem eigenen Server. Beim Aufruf werden keine Daten an Schriftanbieter wie Google übertragen.")),
            dict(h2="Rückruf-Formular", id="formular", html=p(
                "Wenn Sie über das Formular um einen Rückruf bitten, verarbeiten wir die Angaben, die Sie eintragen: Name und Telefonnummer, freiwillig auch Thema, gewünschte Zeit, Nachricht und wie Sie von uns erfahren haben. Die Angaben werden über unseren Server per E-Mail an die Kanzlei geschickt und nur genutzt, um Sie zurückzurufen und Ihr Anliegen zu bearbeiten.",
                "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, weil die Anfrage der Anbahnung eines Mandats dient, im Übrigen Art. 6 Abs. 1 lit. f DSGVO. Wir löschen die Angaben, wenn sie nicht mehr gebraucht werden und keine gesetzlichen Aufbewahrungspflichten bestehen.",
                "Als Rechtsanwälte unterliegen wir der beruflichen Verschwiegenheitspflicht. Bitte schicken Sie über das Formular trotzdem noch keine vertraulichen Einzelheiten.")),
            dict(h2="Kontakt per E-Mail und Telefon", id="kontakt", html=p(
                "Wenn Sie uns per E-Mail oder Telefon erreichen, verarbeiten wir Ihre Angaben, um Ihr Anliegen zu bearbeiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b oder f DSGVO.")),
            dict(h2="Link zu Google Maps", id="karte", html=p(
                "Auf der Kontaktseite verlinken wir eine Route in Google Maps. Die Karte ist nicht eingebettet. Erst wenn Sie den Link anklicken, öffnet sich die Seite von Google, und es gelten die Datenschutzbestimmungen von Google.")),
            dict(h2="Ihre Rechte", id="rechte", html=p(
                "Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen eine Verarbeitung auf Grundlage berechtigter Interessen (Art. 21 DSGVO). Schreiben Sie uns dafür an die oben genannte Adresse.",
                "Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren. Zuständig für uns ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin.")),
            dict(h2="Verschlüsselung", id="ssl", html=p(
                "Die Website wird verschlüsselt über HTTPS übertragen. Das erkennen Sie am Schloss-Symbol in der Adresszeile Ihres Browsers.")),
        ],
    ),
]
