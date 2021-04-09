/*tslint:disable:no-bitwise */
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
declare var unescape;
declare var XLSX: any;
declare var saveAs: any;

export class SourceColumnDefinition {
    constructor(public sourceColumnName: string, public description: string) { }
}

@Injectable({ providedIn: 'root' })
export class UtilitiesService {


    static APPLICATION_NAME = 'Cogent';
    private static previousTouchSurface;
    private static touchMoveCallback: (e: any) => void;

    private static swipeDir;
    private static dist;
    private static startX;
    private static startY;
    private static startTime;
    private static distX;
    private static distY;
    private static elapsedTime;
    private static threshold = 150;
    private static restraint = 100;
    private static allowedTime = 300000;
    private static handleSwipe;


    private static properties = [
        'boxSizing',
        'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
        'height',
        'overflowX',
        'overflowY',  // copy the scrollbar for IE

        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',

        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',

        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'lineHeight',
        'fontFamily',

        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration',  // might not make a difference, but better be safe

        'letterSpacing',
        'wordSpacing'
    ];

    private static isFirefox = !((window as any).mozInnerScreenX == null);
    private static mirrorDiv;
    private static computed;
    private static style;



    static monthEnd(date: Date): Date {
        const dt = this.monthStart(date);

        dt.setMonth(dt.getMonth() + 1);

        dt.setSeconds(dt.getSeconds() - 1);

        return dt;
    }
    static monthStart(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    static stripeHTML (value: string): string {
        return value.replace(/<.*?>/g, '');
    }

    public static toShortDate(date: Date) {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    public static datesEqual(date1: Date, date2: Date) {
        return date1.getDate() === date2.getDate()
            && date1.getMonth() === date2.getMonth()
            && date1.getFullYear() === date2.getFullYear();
    }

    public static convertCamelCaseToWords(camelCaseWords: string): string {
        if (!camelCaseWords) {
            return null;
        }

        return camelCaseWords.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([a-zA-Z])([0-9])/g, '$1 $2');
    }

    public static CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ) {

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return (arrData);
    }

    public static copyObject(source: any, destination: any = null, typeCreator: () => any = null) {
        if (!destination) {
            if (typeCreator) {
                destination = typeCreator();
            } else {
                destination = {};
            }
        }
        for (const property in source) {
            if (source.hasOwnProperty(property)) {
                try {
                    destination[property] = source[property];
                } catch (e) { }
            }
        }

        return destination;
    }

    public static copyArrayToTypedArray(source: any[], typeCreator: () => any = null): any[] {
        const results = [];
        for (const original of source) {

            let copy = typeCreator();
            copy = this.copyObject(original, copy);
            results.push(copy);
        }

        return results;
    }


    static prevMonthStart(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setMonth(dt.getMonth() - 1);
        return UtilitiesService.monthStart(dt);
    }

    static nextMonthStart(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setMonth(dt.getMonth() + 1);
        return UtilitiesService.monthStart(dt);
    }

    static prevMonthEnd(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setMonth(dt.getMonth() - 1);
        return UtilitiesService.monthEnd(dt);

    }

    static nextMonthEnd(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setMonth(dt.getMonth() + 1);
        return UtilitiesService.monthEnd(dt);
    }

    static prevYearStart(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setFullYear(dt.getFullYear() - 1);
        dt.setMonth(0);
        return UtilitiesService.monthStart(dt);
    }

    static prevYearEnd(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setFullYear(dt.getFullYear() - 1);
        dt.setMonth(11);
        return UtilitiesService.monthEnd(dt);
    }

    static nextYearStart(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setFullYear(dt.getFullYear() + 1);
        return UtilitiesService.monthStart(dt);
    }

    static nextYearEnd(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setFullYear(dt.getFullYear() + 1);
        dt.setMonth(11);
        return UtilitiesService.monthEnd(dt);
    }

    static quarterStart(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        while (dt.getMonth() !== 0 && dt.getMonth() !== 3 && dt.getMonth() !== 6 && dt.getMonth() !== 9) {
            dt.setMonth(dt.getMonth() - 1);
        }

        return UtilitiesService.monthStart(dt);
    }

    static quarterEnd(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        while (dt.getMonth() !== 2 && dt.getMonth() !== 5 && dt.getMonth() !== 8 && dt.getMonth() !== 11) {
            dt.setMonth(dt.getMonth() + 1);
        }

        return UtilitiesService.monthEnd(dt);
    }

    static prevQuarterStart(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setMonth(dt.getMonth() - 3);

        return UtilitiesService.quarterStart(dt);
    }

    static prevQuarterEnd(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setMonth(dt.getMonth() - 3);

        return UtilitiesService.quarterEnd(dt);
    }

    static nextQuarterStart(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setMonth(dt.getMonth() + 3);

        return UtilitiesService.quarterStart(dt);
    }

    static nextQuarterEnd(date: Date = null) {
        const dt = new Date(date ? date : new Date());
        dt.setMonth(dt.getMonth() + 3);

        return UtilitiesService.quarterEnd(dt);
    }

    static getDateRangeFromDates(startDate: Date, endDate: Date) {
        for (const range of Object.values(DateRangeType)) {
            const dates = UtilitiesService.getDatesFromDateRange(range);


            if (dates.length === 2 && UtilitiesService.datesEqual(startDate, dates[0]) && UtilitiesService.datesEqual(endDate, dates[1])) {
                return range;
            }
        }
    }

    static getDatesFromDateRange(dateRange: DateRangeType) {
        if (dateRange === DateRangeType.ThisMonth) {
            return [
                UtilitiesService.monthStart(new Date()),
                UtilitiesService.monthEnd(new Date()),
            ];
        }
        if (dateRange === DateRangeType.LastMonth) {

            return [
                UtilitiesService.prevMonthStart(new Date()),
                UtilitiesService.prevMonthEnd(new Date()),
            ];
        }
        if (dateRange === DateRangeType.ThisWeek) {
            return [UtilitiesService.weekStart(new Date()),
            UtilitiesService.weekEnd(new Date())
            ];
        }
        if (dateRange === DateRangeType.ThisQuarter) {
            return [
                UtilitiesService.quarterStart(),
                UtilitiesService.quarterEnd(),
            ];
        }
        if (dateRange === DateRangeType.LastQuarter) {
            return [
                UtilitiesService.prevQuarterStart(),
                UtilitiesService.prevQuarterEnd(),
            ];
        }
        if (dateRange === DateRangeType.ThisYear) {
            return [
                UtilitiesService.yearStart(new Date()),
                UtilitiesService.yearEnd(new Date())
            ];
        }
        if (dateRange === DateRangeType.LastYear) {
            return [
                UtilitiesService.prevYearStart(),
                UtilitiesService.prevYearEnd(),
            ];
        }
        if (dateRange === DateRangeType.Last7Days) {
            let dt = new Date();
            dt.setDate(dt.getDate() - 7);
            dt = UtilitiesService.dayBegin(dt);
            return [
                dt,
                new Date(),
            ];
        }
        if (dateRange === DateRangeType.Last30Days) {
            let dt = new Date();
            dt.setDate(dt.getDate() - 30);
            dt = UtilitiesService.dayBegin(dt);

            return [
                dt,
                new Date()
            ];
        }
        if (dateRange === DateRangeType.Next30Days) {
            let dt = new Date();
            dt.setDate(dt.getDate() + 30);
            dt = UtilitiesService.dayBegin(dt);

            return [
                UtilitiesService.dayBegin(new Date()),
                UtilitiesService.dayEnd(dt),
            ];
        }
        if (dateRange === DateRangeType.Last60Days) {
            let dt = new Date();
            dt.setDate(dt.getDate() - 60);
            dt = UtilitiesService.dayBegin(dt);

            return [
                dt,
                new Date()
            ];
        }
        if (dateRange === DateRangeType.Last90Days) {
            let dt = new Date();
            dt.setDate(dt.getDate() - 90);
            dt = UtilitiesService.dayBegin(dt);

            return [
                dt,
                new Date()
            ];
        }
        if (dateRange === DateRangeType.Last6Months) {
            let dt = new Date();
            dt.setMonth(dt.getMonth() - 6);
            dt = UtilitiesService.dayBegin(dt);

            return [
                dt,
                new Date()
            ];
        }
        if (dateRange === DateRangeType.Last12Months) {
            let dt = new Date();
            dt.setMonth(dt.getMonth() - 12);
            dt = UtilitiesService.dayBegin(dt);

            return [
                dt,
                new Date()
            ];
        }
        if (dateRange === DateRangeType.NextMonth) {
            return [
                this.nextMonthStart(),
                this.nextMonthEnd(),
            ];
        }
        if (dateRange === DateRangeType.NextQuarter) {
            return [
                this.nextQuarterStart(),
                this.nextQuarterEnd(),
            ];
        }
        if (dateRange === DateRangeType.NextYear) {
            return [
                this.nextYearStart(),
                this.nextYearEnd(),
            ];
        }
        if (dateRange === DateRangeType.Yesterday) {
            let dt = new Date();
            dt.setDate(dt.getDate() - 1);
            return [
                this.dayBegin(dt),
                this.dayEnd(dt),
            ];
        }
        if (dateRange === DateRangeType.Today) {
            const dt = new Date();
            return [
                this.dayBegin(dt),
                this.dayEnd(dt),
            ];
        }
        return [];
    }

    static weekStart(date: Date): Date {
        const result = new Date(date);
        while (result.getDay() !== 1) {
            result.setDate(result.getDate() - 1);
        }
        result.setHours(0);
        result.setMinutes(0);
        result.setSeconds(0);
        result.setMilliseconds(0);

        return result;
    }

    static weekEnd(date: Date): Date {
        const result = new Date(date);
        while (result.getDay() !== 6) {
            result.setDate(result.getDate() + 1);
        }
        result.setHours(23);
        result.setMinutes(59);
        result.setSeconds(59);
        result.setMilliseconds(0);

        return result;
    }

    static yearStart(date: Date): Date {
        return new Date(date.getFullYear(), 0, 1);
    }

    static yearEnd(date: Date): Date {
        return new Date(date.getFullYear(), 11, 31);
    }



    public static exportDataSource(source: any[], sourceColumnDefinitions: SourceColumnDefinition[]) {
        let tableHtml = '<table><thead><tr>';
        const datePipe = new DatePipe('en-US');

        for (const def of sourceColumnDefinitions) {
            tableHtml += `<th>${def.description}</th>`;
        }
        tableHtml += '</tr></thead><tbody>';
        for (const row of source) {
            tableHtml += '<tr>';
            for (const def of sourceColumnDefinitions) {
                const value = row[def.sourceColumnName];
                if (value && value.getTime) {
                    const formattedValue = `${datePipe.transform(value, 'shortDate')} ${datePipe.transform(value, 'shortTime')}`;
                    tableHtml += `<td>${formattedValue}</td>`;
                } else {
                    tableHtml += `<td>${row[def.sourceColumnName] ? row[def.sourceColumnName] : ''}</td>`;
                }
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';

        const uri = 'data:application/vnd.ms-excel;base64,';
        const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"'
            + ' xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>'
            + '<x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>'
            + '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table>'
            + '</body></html>';

        const base64 = (s) => {
            return window.btoa(unescape(encodeURIComponent(s)));
        };
        const format = (s, c) => {
            return s.replace(/{(\w+)}/g, (m, p) => c[p]);
        };

        const ctx = { worksheet: 'Tab 1', table: tableHtml };
        window.location.href = uri + base64(format(template, ctx));
    }

    public static export(elementName = 'reportArea', exportFileName = 'export.xlsx'): void {
        // // this.tableToExcel(elementName, '');
        // const uri = 'data:application/vnd.ms-excel;base64,';
        // const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"'
        //     + ' xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>'
        //     + '<x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>'
        //     + '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table>'
        //     + '</body></html>';

        // const base64 = (s) => {
        //     return window.btoa(unescape(encodeURIComponent(s)));
        // };
        // const format = (s, c) => {
        //     return s.replace(/{(\w+)}/g, (m, p) => c[p]);
        // };
        // const table = document.getElementById(elementName);
        // const ctx = { worksheet:  'Tab 1', table: table.innerHTML };
        // window.location.href = uri + base64(format(template, ctx));
        var wb = XLSX.utils.table_to_book(document.getElementById(elementName), { sheet: "Sheet1" });
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        const s2ab = (s) => {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };

        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }),  exportFileName);
    }

    public static printArea(elementName = 'reportArea', prtContent: any = null, loadPrintStyleSheet = true): void {
        if (!prtContent) {
            prtContent = document.getElementById(elementName);
        }
        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

        const styleSheetLink = loadPrintStyleSheet ?
            '<link rel="stylesheet" href="/assets/print.css?v=5">' :
            '<link rel="stylesheet" href="/assets/documentprint.css?v=5">';
        WinPrint.document.write(styleSheetLink +
            ' <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" /><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
            + prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        setTimeout(() => {

            WinPrint.print();
            WinPrint.close();
        }, 1000);
    }

    public static getShortDate(date: Date): string {

        if (!date) { return null; }

        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }

    public static popupHtml(html: string) {
        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

        WinPrint.document.write(html);
        WinPrint.document.close();
        WinPrint.focus();
    }


    public static get applicationName() {
        return this.APPLICATION_NAME;
    }
    public static set applicationName(value: string) {
        this.APPLICATION_NAME = value;
    }

    static get quickBooksCompanyId() {
        return 193514832096804;
    }

    public static dayEnd(date: Date): Date {
        const dt = new Date(date);
        dt.setHours(0);
        dt.setMinutes(0);
        dt.setSeconds(0);
        dt.setMilliseconds(0);

        dt.setDate(dt.getDate() + 1);
        dt.setSeconds(-1);

        return dt;
    }

    public static dateString(date: Date): string {
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();

        if (month.length === 1) {
            month = '0' + month;
        }
        if (day.length === 1) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    }

    public static parseDate(dateString: string): Date {
        const dt = new Date(dateString);
        return new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
    }

    public static getDateGrouping(date: Date): string {
        const dateToCompare = new Date();

        if (dateToCompare.getDate() === date.getDate() && dateToCompare.getMonth() === date.getMonth()
            && dateToCompare.getFullYear() === date.getFullYear()) {
            return 'Today';
        }

        dateToCompare.setDate(dateToCompare.getDate() - 1);
        if (dateToCompare.getDate() === date.getDate() && dateToCompare.getMonth() === date.getMonth()
            && dateToCompare.getFullYear() === date.getFullYear()) {
            return 'Yesterday';
        }

        dateToCompare.setDate(dateToCompare.getDate() + 1);
        while (dateToCompare.getDay() > 0) {
            dateToCompare.setDate(dateToCompare.getDate() - 1);
        }

        if (date >= dateToCompare) {
            return 'This Week';
        }

        dateToCompare.setDate(dateToCompare.getDate() - 7);
        if (date >= dateToCompare) {
            return 'Last Week';
        }

        if (date.getMonth() === dateToCompare.getMonth() && date.getFullYear() === dateToCompare.getFullYear()) {
            return 'This Month';
        }

        if (date.getFullYear() === dateToCompare.getFullYear()) {
            return 'This Year';
        }

        if (date.getFullYear() === dateToCompare.getFullYear() - 1) {
            return 'Last Year';
        }

        return 'Older';
    }

    public static dayBegin(date: Date): Date {
        const dt = new Date(date);
        dt.setHours(0);
        dt.setMinutes(0);
        dt.setSeconds(0);
        dt.setMilliseconds(0);

        return dt;
    }

    public static newid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static getSelectionCoords(win) {
        win = win || window;
        var doc = win.document;
        var sel = doc.selection, range, rects, rect;
        var x = 0, y = 0;
        if (sel) {
          if (sel.type != "Control") {
            range = sel.createRange();
            range.collapse(true);
            x = range.boundingLeft;
            y = range.boundingTop;
          }
        } else if (win.getSelection) {
          sel = win.getSelection();
          if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getClientRects) {
              range.collapse(true);
              rects = range.getClientRects();
              if (rects.length > 0) {
                rect = rects[0];
              }
              if (rect) {
                x = rect.left;
                y = rect.top;
              }
            }
            // Fall back to inserting a temporary element
            if (x == 0 && y == 0) {
              var span = doc.createElement("span");
              if (span.getClientRects) {
                // Ensure span has dimensions and position by
                // adding a zero-width space character
                span.appendChild(doc.createTextNode("\u200b"));
                range.insertNode(span);
                rect = span.getClientRects()[0];
                x = rect.left;
                y = rect.top;
                var spanParent = span.parentNode;
                spanParent.removeChild(span);
    
                // Glue any broken text nodes back together
                spanParent.normalize();
              }
            }
          }
        }
        return { left: x, top: y };
      }

    public static validateEmail(email: string): boolean {
        // return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        if (!email) {
            return false;
        }
        return /^\S+@\S+\.\S+$/.test(email.trim());
    }

    public static validateEmailList(email: string): boolean {
        if (!email) {
            return false;
        }

        const emailsSplit = email.split(',');
        for (const emailSplit of emailsSplit) {
            if (!UtilitiesService.validateEmail(emailSplit)) {
                return false;
            }
        }

        return true;
    }

    public static validatePhoneNumber(phoneNumber: string): boolean {
        // if(phoneNumber && phoneNumber.indexOf(',')) {
        //     phoneNumber = phoneNumber.substring(0,phoneNumber.indexOf(','));
        // }
        if (/^[0-9]{10}$/.test(phoneNumber)) {
            return true;
        }
        return /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/.test(phoneNumber);
    }

    public static getCategoryUrl(category: string): string {
        if (category === 'Plumbing') {
            return 'assets/images/plumbing.png';
        }
        if (category === 'A/C & Heating') {
            return 'assets/images/thermometer.png';
        }
        if (category === 'Appliance') {
            return 'assets/images/washer.png';
        }
        if (category === 'Electrical') {
            return 'assets/images/outlet.png';
        }
        if (category === 'Outdoor') {
            return 'assets/images/sprinkler.png';
        }
        if (category === 'Services') {
            return 'assets/images/handshake.png';
        }

        return null;
    }

    public static replaceValuesInStringFromObject(source: string, values: any, prefix = '', escapeDoubleQuotes = false): string {
        let result = String(source);
        const datePipe = new DatePipe('en-US');
        result = result.replace('{{newDate()}}', datePipe.transform(new Date()));


        if (values) {
            for (const key of Object.keys(values)) {
                const searchFor = prefix ? `${prefix}.${key}` : key;
                let replaceValue = values[key];

                if (escapeDoubleQuotes && replaceValue) {
                    replaceValue = UtilitiesService.replaceAllRegEx(replaceValue, '"', '\\"');
                }
                result = this.replaceAll(result, `{{${searchFor}}}`, replaceValue);
            }

            // Seems like this is the wrong way, but I can't find another way to iterate over getters
            if (values.__proto__) {
                for (const keyItem of Reflect.ownKeys(values.__proto__)) {
                    const key = keyItem.toString();
                    const searchFor = prefix ? `${prefix}.${key}` : key;

                    let replaceValue = values[key];
                    if (escapeDoubleQuotes && replaceValue) {
                        replaceValue = UtilitiesService.replaceAllRegEx(replaceValue, '"', '\\"');

                    }

                    result = this.replaceAll(result, `{{${searchFor}}}`, replaceValue);
                }
            }
        }

        return result;
    }

    public static replaceAll(target: string, search: string, replacement: string) {
        if (!target) {
            return '';
        }
        if (!replacement) {
            replacement = '';
        }
        return target.split(search).join(replacement);
    }

    public static stripPhoneFormatting(phoneNumber: string): string {
        if (!phoneNumber) {
            return null;
        }

        return UtilitiesService.replaceAll(UtilitiesService.replaceAll(UtilitiesService.replaceAll(UtilitiesService.replaceAll(UtilitiesService.replaceAll(phoneNumber, '.', ''), '(', ''), ')', ''), ' ', ''), '-', '');
    }

    public static formatPhoneNumber(phoneNumber: string): string {
        const strippedNumber = UtilitiesService.stripPhoneFormatting(phoneNumber);
        if (!strippedNumber || strippedNumber.length < 10) {
            return strippedNumber;
        }

        return `(${strippedNumber.substring(0, 3)}) ${strippedNumber.substring(3, 6)}-${strippedNumber.substring(6, 10)}`;
    }

    public static replaceAllRegEx(target: string, search: string, replacement: string) {
        if (!target) {
            return '';
        }
        if (!target.replace) {
            return target;
        }
        return target.replace(new RegExp(search, 'g'), replacement);
    }


    public static getCaretCoordinates(element, position) {
        this.mirrorDiv = document.getElementById(element.nodeName + '--mirror-div');
        if (!this.mirrorDiv) {
            this.mirrorDiv = document.createElement('div');
            this.mirrorDiv.id = element.nodeName + '--mirror-div';
            document.body.appendChild(this.mirrorDiv);
        }

        this.style = this.mirrorDiv.style;
        this.computed = getComputedStyle(element);

        this.style.whiteSpace = 'pre-wrap';
        if (element.nodeName !== 'INPUT') {
            this.style.wordWrap = 'break-word';
        }

        this.style.position = 'absolute';
        this.style.top = element.offsetTop + parseInt(this.computed.borderTopWidth, 10) + 'px';
        this.style.left = "400px";
        this.style.visibility = false ? 'visible' : 'hidden';

        this.properties.forEach(prop => {
            this.style[prop] = this.computed[prop];
        });

        if (this.isFirefox) {
            this.style.width = parseInt(this.computed.width, 10) - 2 + 'px';

            if (element.scrollHeight > parseInt(this.computed.height, 10)) {
                this.style.overflowY = 'scroll';
            }
        } else {
            this.style.overflow = 'hidden';
        }

        this.mirrorDiv.textContent = element.value.substring(0, position);
        if (element.nodeName === 'INPUT') {
            this.mirrorDiv.textContent = this.mirrorDiv.textContent.replace(/\s/g, "\u00a0");
        }

        const span = document.createElement('span');
        span.textContent = element.value.substring(position) || '.';
        this.mirrorDiv.appendChild(span);

        const coordinates = {
            top: span.offsetTop + parseInt(this.computed.borderTopWidth, 10),
            left: span.offsetLeft + parseInt(this.computed.borderLeftWidth, 10)
        };

        return coordinates;
    }
    static touchStart(e) {

        const touchObj = e.changedTouches[0];
        UtilitiesService.swipeDir = 'none';
        UtilitiesService.dist = 0;
        UtilitiesService.startX = touchObj.pageX;
        UtilitiesService.startY = touchObj.pageY;
        UtilitiesService.startTime = new Date().getTime();
    }

    static touchEnd(e) {
        const touchObj = e.changedTouches[0];
        UtilitiesService.distX = touchObj.pageX - UtilitiesService.startX;
        UtilitiesService.distY = touchObj.pageY - UtilitiesService.startY;
        UtilitiesService.elapsedTime = new Date().getTime() - UtilitiesService.startTime;
        if (UtilitiesService.elapsedTime <= UtilitiesService.allowedTime) {
            if (Math.abs(UtilitiesService.distX) >= UtilitiesService.threshold && Math.abs(UtilitiesService.distY) <= UtilitiesService.restraint) {
                UtilitiesService.swipeDir = (UtilitiesService.distX < 0) ? 'left' : 'right';
            } else if (Math.abs(UtilitiesService.distY) >= UtilitiesService.threshold && Math.abs(UtilitiesService.distX) <= UtilitiesService.restraint) {
                UtilitiesService.swipeDir = (UtilitiesService.distY < 0) ? 'up' : 'down';
            }
        }
        if (UtilitiesService.swipeDir !== 'none' && UtilitiesService.handleSwipe) {
            UtilitiesService.handleSwipe(UtilitiesService.swipeDir, e);
        }
    }

    static touchMove(e) {
        const touchObj = e.changedTouches[0];
        const distX = touchObj.pageX - UtilitiesService.startX;
        if (UtilitiesService.touchMoveCallback) {
            UtilitiesService.touchMoveCallback(distX);
        }
    }

    static swipeDetect(el, callback, touchMoveCallback: (event: any) => void = null) {
        if (UtilitiesService.previousTouchSurface) {
            UtilitiesService.previousTouchSurface.removeEventListener('touchstart', UtilitiesService.touchStart);
            UtilitiesService.previousTouchSurface.removeEventListener('touchend', UtilitiesService.touchEnd);
            UtilitiesService.previousTouchSurface.removeEventListener('touchmove', UtilitiesService.touchMove);
        }

        const touchSurface = el;

        UtilitiesService.handleSwipe = callback;
        if (callback) {
            touchSurface.addEventListener('touchstart', UtilitiesService.touchStart, true);
            touchSurface.addEventListener('touchend', UtilitiesService.touchEnd, true);
            UtilitiesService.previousTouchSurface = touchSurface;
        }

        UtilitiesService.touchMoveCallback = touchMoveCallback;
        if (touchMoveCallback) {
            touchSurface.addEventListener('touchmove', UtilitiesService.touchMove, true);
            UtilitiesService.previousTouchSurface = touchSurface;
        }
    }
}

export enum DateRangeType {
    Today = 'Today',
    Yesterday = 'Yesterday',
    ThisWeek = 'ThisWeek',
    Last7Days = 'Last7Days',
    ThisMonth = 'ThisMonth',
    Last30Days = 'Last30Days',
    LastMonth = 'LastMonth',
    Last60Days = 'Last60Days',
    ThisQuarter = 'ThisQuarter',
    Last90Days = 'Last90Days',
    LastQuarter = 'LastQuarter',
    Last6Months = 'Last6Months',
    ThisYear = 'ThisYear',
    Last12Months = 'Last12Months',
    LastYear = 'LastYear',
    NextMonth = 'NextMonth',
    NextQuarter = 'NextQuarter',
    NextYear = 'NextYear',
    Next30Days = 'Next30Days',
    None = 'None',
    Null = 'Null',
}