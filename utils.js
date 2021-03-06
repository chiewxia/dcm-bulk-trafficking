/***********************************************************************
Copyright 2018 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Note that these code samples being shared are not official Google
products and are not formally supported.
***********************************************************************/

// Global variables/configurations
var DCMProfileID = 'DCMProfileID';
var AUTO_POP_HEADER_COLOR = '#a4c2f4';
var USER_INPUT_HEADER_COLOR = '#b6d7a8';
var AUTO_POP_CELL_COLOR = 'lightgray';

// Data range values
var DCMUserProfileID = 'DCMUserProfileID';

// sheet names
var SETUP_SHEET = 'Setup';
var SITES_SHEET = 'Sites';
var CAMPAIGNS_SHEET = 'Campaigns';
var PLACEMENTS_SHEET = 'Placements';
var ADS_SHEET = 'Ads';
var CREATIVES_SHEET = 'Creatives';

/**
 * Helper function to get DCM Profile ID.
 * @return {object} DCM Profile ID.
 */
function _fetchProfileId() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = ss.getRangeByName(DCMUserProfileID);
  return range.getValue();
}


/**
 * Find and clear, or create a new sheet named after the input argument.
 * @param {string} sheetName The name of the sheet which should be initialized.
 * @param {boolean} lock To lock the sheet after initialization or not
 * @return {object} A handle to a sheet.
 */
function initializeSheet_(sheetName, lock) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (sheet == null) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  if (lock) {
    sheet.protect().setWarningOnly(true);
  }
  return sheet;
}


/**
 * Initialize all tabs and their header rows
 */
function setupTabs() {
  _setupSetupSheet();
  _setupSitesSheet();
  _setupCampaignsSheet();
  _setupPlacementsGroupsSheet();
  _setupAdsSheet();
  _setupCreativesSheet();
}

/**
 * Initialize the Setup sheet and its header row
 * @return {object} A handle to the sheet.
*/
function _setupSetupSheet() {
  var sheet = initializeSheet_(SETUP_SHEET, false);

  sheet.getRange('B2').setValue('DCM Bulk Trafficking');
  sheet.getRange('E2').setValue('Initial setup:');
  sheet.getRange('E3').setValue('1) Make a copy of this template trix');
  sheet.getRange('E4').setValue('2) In Menu, Go to [Tools] > [Script editor]');
  sheet.getRange('E5').setValue('3) [New browser tab of the appscript]'+
                                '[Resources] > [Advanced Google Services]');
  sheet.getRange('E6').setValue('4) [Advanced Google Services] Enable'+
                                ' \"DCM/DFA Reporting And Trafficking API\"');
  sheet.getRange('E7').setValue('5) [Advanced Google Services] Click \"Google'+
                                ' API Console\" at the bottom of the window');
  sheet.getRange('E8').setValue('6) [New browser tab of cloud project] '+
                                '[Library] Search and enable \"DCM/DFA '+
                                'Reporting And Trafficking API\"');
  sheet.getRange('E9').setValue('7) Go back to appscript tab, select OK and '+
                                'close the [Advanced Google Services] window');

  sheet.getRange('E12').setValue('How to use:');
  sheet.getRange('E13').setValue('1) Enter DCM Profile ID in C5 of this tab');
  sheet.getRange('E14').setValue('2) [Sites tab] Retrieve the list of sites '+
                                 'and IDs by [DCM Functions] > [List Sites]');
  sheet.getRange('E15').setValue('3) [Campaigns tab] Bulk create Campaigns by'+
                                 ' [DCM Functions] > [Bulk Create Campaigns]');
  sheet.getRange('E16').setValue('4) [Placements tab]  Bulk create Placements'+
                                 ' groups by [DCM Functions] > '+
                                 '[Bulk Create Placements]');
  sheet.getRange('E17').setValue('5) [Ads tab] Bulk create Ads by '+
                                 '[DCM Functions]>[Bulk Create Ads]');
  sheet.getRange('E18').setValue('6) [Creatives tab] Bulk create Creatives by'+
                                 ' [DCM Functions]>[Bulk Create Creatives]');

  sheet.getRange('E21')
      .setValue('Legends')
      .setFontWeight('bold')
      .setFontSize(12);
  sheet.getRange('E22').setValue('Green Cells / Columns are for input');
  sheet.getRange('E23').setValue(
      'Blue Cells /Columns are for the script to populate (do not edit)');
  sheet.getRange('E21:M21').setBackground('#f9cb9c');
  sheet.getRange('E22:M22').setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('E23:M23').setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRangeList(['B2:C2','E2:M2','E12:M12'])
      .setFontWeight('bold')
      .setWrap(true)
      .setBackground(AUTO_POP_HEADER_COLOR).setFontSize(12);
  sheet.getRange('B5').setValue('User Profile ID')
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C5').setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B5:C5')
      .setFontWeight('bold')
      .setWrap(true);

  return sheet;

}

/**
 * Initialize the Sites sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupSitesSheet() {
  var sheet = initializeSheet_(SITES_SHEET, true);

  sheet.getRange('A1')
      .setValue('Site Name')
      .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('B1')
      .setValue('Directory Site ID')
      .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('A1:B1').setFontWeight('bold').setWrap(true);
  return sheet;
}

/**
 * Initialize the Campaigns sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupCampaignsSheet() {
  var sheet = initializeSheet_(CAMPAIGNS_SHEET, false);

  sheet.getRange('A1')
      .setValue('DCM Advertiser ID*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1')
      .setValue('Campaign Name*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C1')
      .setValue('Landing Page ID*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('D1')
      .setValue('Start Date*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('E1')
      .setValue('End Date*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('F1')
      .setValue('Campaign ID (auto-populated; do not edit)')
      .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('A1:F1')
      .setFontWeight('bold')
      .setWrap(true);
  return sheet;

}

/**
 * Initialize the Placements sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupPlacementsGroupsSheet() {
  var sheet = initializeSheet_(PLACEMENTS_SHEET, false);

  sheet.getRange('A1')
      .setValue('Campaign ID*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1')
      .setValue('Placement Name*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C1')
      .setValue('Site ID*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('D1')
      .setValue('Comptatibility*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('E1').setValue('Size*').setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('F1')
      .setValue('Pricing Schedule Start Date*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('G1')
      .setValue('Pricing Schedule End Date*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('H1')
      .setValue('Pricing Schedule Pricing Type*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('I1')
      .setValue('Tag Formats*')
      .setBackground(USER_INPUT_HEADER_COLOR);

  sheet.getRange('J1').setValue('Placement ID (do not edit; auto-filling)')
       .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange('A1:J1').setFontWeight('bold').setWrap(true);
  return sheet;
}

/**
 * Initialize the Advertisers sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupAdsSheet() {
  var sheet = initializeSheet_(ADS_SHEET, false);

  sheet.getRange('A1')
      .setValue('Campaign ID*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1')
      .setValue('Ad Name*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C1')
      .setValue('Start Date and Time*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('D1')
      .setValue('End Date and Time*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('E1')
      .setValue('Impression Ratio*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('F1')
      .setValue('Priority*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('G1').setValue('Type*').setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('H1')
      .setValue('Placement ID*')
      .setBackground(USER_INPUT_HEADER_COLOR);

  sheet.getRange('I1').setValue('Ad ID (auto-populated; do not edit)')
       .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange('A1:I1').setFontWeight('bold').setWrap(true);
  return sheet;

}

/**
 * Initialize the Creatives sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupCreativesSheet() {
  var sheet = initializeSheet_(CREATIVES_SHEET, false);

  sheet.getRange('A1')
      .setValue('Advertiser ID*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1')
      .setValue('Creative Name*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C1').setValue('Width*').setBackground(
      USER_INPUT_HEADER_COLOR);
  sheet.getRange('D1').setValue('Height*').setBackground(
      USER_INPUT_HEADER_COLOR);
  sheet.getRange('E1')
      .setValue('Creative Type*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('F1')
      .setValue('Creative Asset Type*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('G1')
      .setValue('Creative Asset Name*')
      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('H1')
      .setValue('Creative ID (auto-populated; do not edit)')
      .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange('A1:H1').setFontWeight('bold').setWrap(true);
  return sheet;
}
