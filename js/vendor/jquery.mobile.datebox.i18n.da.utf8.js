/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-datebox
 *
 * Translation by: Jnyrup <crowdin>
 *
 */

jQuery.extend(jQuery.mobile.datebox.prototype.options.lang, {
	'da': {
		setDateButtonLabel: "Angiv dato",
		setTimeButtonLabel: "Angiv tid",
		setDurationButtonLabel: "Angiv varighed",
		calTodayButtonLabel: "Gå til i dag",
		titleDateDialogLabel: "Vælg dato",
		titleTimeDialogLabel: "Vælg tid",
		daysOfWeek: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
		daysOfWeekShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
		monthsOfYear: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"],
		monthsOfYearShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		durationLabel: ["Dage", "Timer", "Minutter", "Sekund"],
		durationDays: ["Dag", "Dage"],
		tooltip: "﻿Åbn datovælger",
		nextMonth: "Næste måned",
		prevMonth: "Forrige måned",
		timeFormat: 24,
		headerFormat: '%A, %B %-d, %Y',
		dateFieldOrder: ['d','m','y'],
		timeFieldOrder: ['h', 'i', 'a'],
		slideFieldOrder: ['y', 'm', 'd'],
		dateFormat: "%d-%m-%Y",
		useArabicIndic: false,
		isRTL: false,
		calStartDay: 0,
		clearButton: "Nulstil",
		durationOrder: ['d', 'h', 'i', 's'],
		meridiem: ["AM", "PM"],
		timeOutput: "%k:%M",
		durationFormat: "%Dd %DA, %Dl:%DM:%DS"
	}
});
jQuery.extend(jQuery.mobile.datebox.prototype.options, {
	useLang: 'da'
});

