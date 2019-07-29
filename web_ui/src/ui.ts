import { Message } from 'amps';
import { AMPSQuery, QueryOptions } from './sql';
import * as settings from './constants.js';

declare var $$: any;


/**
 * This class encapsulates the UI. And provides
 * two-way communication API
 */
export class AMPSQueryUi {
    // private fields
    private _topCustomerQuery: AMPSQuery;
    private _lowestCustomerQuery: AMPSQuery;
    private _topSymbolQuery: AMPSQuery;
    private _lowestSymbolQuery: AMPSQuery;

    private id: string;
    private type: string;
    private rows: any[];

    /**
     * This is the constructor that initializes the UI object.
     */
    constructor() {
        const customerFilterOption = {
            view: 'text',
            id: 'customer_filter',
            label: 'Filters',
            name: 'customer_filter',
            labelAlign: 'right',
            width: 335,
            placeholder: 'Optional: Customer Positions Filter'
        };

        const symbolFilterOption = {
            view: 'text',
            id: 'symbol_filter',
            name: 'symbol_filter',
            labelAlign: 'right',
            width: 335,
            placeholder: 'Optional: Symbol Positions Filter'
        };

        const optionsOption = {
            view: 'text',
            id: 'options',
            label: 'Options',
            labelAlign: 'right',
            width: 280,
            placeholder: 'Optional: Query Options'
        };

        const topNOption = {
            view: 'text',
            id: 'top_n',
            label: 'TopN',
            labelAlign: 'right',
            width: 280,
            placeholder: 'Optional: Top N records'
        };
        
        const connectButton = {
            view: 'button',
            id: 'connect_button',
            value: 'Connect',
            width: 100,
            hotkey: 'enter',
            click: () => {
                const topCustomerProfitTable = $$('top_customer_profit_table');
                const lowestCustomerProfitTable = $$('lowest_customer_profit_table');
                const topSymbolProfitTable = $$('top_symbol_profit_table');
                const lowestSymbolProfitTable = $$('lowest_symbol_profit_table');

                // Stop button pressed
                if ($$('connect_button').getValue() === 'Stop') {
                    // stop the quries, if any
                    if (this._topCustomerQuery) { this._topCustomerQuery.stop(); }
                    if (this._lowestCustomerQuery) { this._lowestCustomerQuery.stop(); }
                    if (this._topSymbolQuery) { this._topSymbolQuery.stop(); }
                    if (this._lowestSymbolQuery) { this._lowestSymbolQuery.stop(); }

                    this.enableFormControls();

                    topCustomerProfitTable.clearAll();
                    lowestCustomerProfitTable.clearAll();
                    topSymbolProfitTable.clearAll();
                    lowestSymbolProfitTable.clearAll();

                    return;
                }

                // Connect button pressed
                this.enableFormControls(false);

                let topN = $$('top_n').getValue();
                if (!topN) { topN = 10; }

                // subscribe for 4 main grids
                this._topCustomerQuery = this.sowAndSubscribe(topCustomerProfitTable, {
                    topic: 'customer_positions',
                    topN: topN,
                    filter: (<string>$$('customer_filter').getValue()),
                    orderBy: '/profit DESC',
                    options: (<string>$$('options').getValue())
                });
                this._lowestCustomerQuery = this.sowAndSubscribe(lowestCustomerProfitTable, {
                    topic: 'customer_positions',
                    topN: topN,
                    filter: (<string>$$('customer_filter').getValue()),
                    orderBy: '/profit',
                    options: (<string>$$('options').getValue())
                }, 'asc');
                this._topSymbolQuery = this.sowAndSubscribe(topSymbolProfitTable, {
                    topic: 'symbol_positions',
                    topN: topN,
                    filter: (<string>$$('symbol_filter').getValue()),
                    orderBy: '/profit DESC',
                    options: (<string>$$('options').getValue())
                });
                this._lowestSymbolQuery = this.sowAndSubscribe(lowestSymbolProfitTable, {
                    topic: 'symbol_positions',
                    topN: topN,
                    filter: (<string>$$('symbol_filter').getValue()),
                    orderBy: '/profit',
                    options: (<string>$$('options').getValue())
                }, 'asc');
            }
        };

        // Create the form itself
        const form = {
            view: 'form',
            id: 'query_controls',
            fillspace: true,
            margin: 5,
            elements: [
                {cols: [
                    customerFilterOption,
                    {width: 12},
                    symbolFilterOption,
                    {width: 12}
                ]},
                {cols: [
                    topNOption,
                    optionsOption,
                    {width: 24},
                    connectButton,
                    {width: 12}
                ]}
            ]
        };

        // Create the customer position profit tables
        const topCustomerProfitTable = {
            id: 'top_customer_profit_table',
            view: 'datatable',
            columns: [ 
                {
                    id: 'symbol',
                    header: 'Symbol',
                    fillspace: 1
                },
                {
                    id: 'name',
                    header: 'Company',
                    fillspace: 2
                },
                {
                    id: 'vwap',
                    header: 'VWAP',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                },
                {
                    id: 'profit',
                    header: 'Profit',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                }
            ],
            resizeColumn: true,
            autoConfig: true
        };
        const lowestCustomerProfitTable = {
            id: 'lowest_customer_profit_table',
            view: 'datatable',
            columns: [ 
                {
                    id: 'symbol',
                    header: 'Symbol',
                    fillspace: 1
                },
                {
                    id: 'name',
                    header: 'Company',
                    fillspace: 2
                },
                {
                    id: 'vwap',
                    header: 'VWAP',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                },
                {
                    id: 'profit',
                    header: 'Profit',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                }
            ],
            resizeColumn: true,
            autoConfig: true
        };

        // Create the symbol profit tables
        const topSymbolProfitTable = {
            id: 'top_symbol_profit_table',
            view: 'datatable',
            columns: [ 
                {
                    id: 'symbol',
                    header: 'Symbol',
                    fillspace: 1
                },
                {
                    id: 'vwap',
                    header: 'VWAP',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                },
                {
                    id: 'profit',
                    header: 'Profit',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                }
            ],
            resizeColumn: true,
            autoConfig: true
        };
        const lowestSymbolProfitTable = {
            id: 'lowest_symbol_profit_table',
            view: 'datatable',
            columns: [ 
                {
                    id: 'symbol',
                    header: 'Symbol',
                    fillspace: 1
                },
                {
                    id: 'vwap',
                    header: 'VWAP',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                },
                {
                    id: 'profit',
                    header: 'Profit',
                    fillspace: 1,
                    css: {'text-align': 'right'},
                    format: webix.i18n.priceFormat
                }
            ],
            resizeColumn: true,
            autoConfig: true
        };

        // Build the UI together
        this.id = 'amps_view_server_demo_widget';
        this.type = 'clean';
        this.rows = [
            {
                view: 'template',
                template: `<img src="img/logo.png" id="logo" /> AMPS View Server Demo`,
                type: 'header',
                css: 'component-header'
            },
            form,
            {cols: [
                {rows: [
                    {
                        view: 'template',
                        template: 'Best Customer Positions by Profit',
                        height: 28,
                        type: 'header',
                        css: 'results-header'
                    },
                    topCustomerProfitTable,
                    {
                        view: 'template',
                        template: 'Worst Customer Positions by Profit',
                        height: 28,
                        type: 'header',
                        css: 'results-header'
                    },
                    lowestCustomerProfitTable
                ]},
                {rows: [
                    {
                        view: 'template',
                        template: 'Best Symbols by Profit',
                        height: 28,
                        type: 'header',
                        css: 'results-header'
                    },
                    topSymbolProfitTable,
                    {
                        view: 'template',
                        template: 'Worst Symbols by Profit',
                        height: 28,
                        type: 'header',
                        css: 'results-header'
                    },
                    lowestSymbolProfitTable
                ]}
            ]}
        ];
    }

    /**
     * This is a helper private method that switches the query form state.
     * @param enable The form is enabled if true, disabled otherwise.
     */
    private enableFormControls(enable: boolean = true): void {
        const button = $$('connect_button');
        const method = enable ? 'enable' : 'disable';

        $$('top_n')[method]();
        $$('customer_filter')[method]();
        $$('symbol_filter')[method]();
        $$('options')[method]();
        button.setValue(enable ? 'Connect' : 'Stop');
        button.refresh();
    }

    sowAndSubscribe(table: webix.ui.datatable, queryParams: QueryOptions, order: string = 'desc'): AMPSQuery  {
        // get data from AMPS and display it
        const query = new AMPSQuery(); 
        query.start(
            queryParams,

            // SOW loaded
            messages => {
                // set the grid data
                table.parse(messages.slice(0, queryParams.topN), 'json');
            },

            // New message received
            message => {
                table.add(message);
                table.showItem(message.id);
                table.addRowCss(message.id, 'new-row');
                setTimeout(() => { table.removeRowCss(message.id, 'new-row'); }, 800);
                table.sort('#profit#', order);
            },

            // Update message received
            message => {
                table.showItem(message.id);

                // set 'updated' animation
                table.addRowCss(message.id, 'updated-row');

                // update the cell data
                table.updateItem(message.id, message);
                setTimeout(() => { table.removeRowCss(message.id, 'updated-row'); }, 800);
                table.sort('#profit#', order);
            },

            // OOF (delete) message received
            message => {
                // set removal animation
                table.showItem(message.id);
                table.addRowCss(message.id, 'removed-row');
                table.updateItem(message.id, message);

                // remove it from the table
                setTimeout(() => {
                    try {
                        if (table.getItem(message.id) && 
                            table.hasCss(message.id, 'removed-row')) {
                            table.remove(message.id);
                        }
                    }
                    catch (err) {
                        console.error('err: ', err);
                    }
                }, 800);
            },

            // Error occurred
            err => this.reportError.bind(this)
        );

        return query;
    }

    /**
     * This method allows to report an error using GUI alert form.
     */
    reportError(error: Error, resetUi: boolean = true): void {
        webix.message({
            text: error.message ? error.message : 'Connection Error',
            type: 'error',
            expire: 5000
        });

        if (resetUi) {
            this.enableFormControls(true);
        }
    }
}
