/* eslint flowtype-errors/show-errors: 0 */
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import ClippyPage from './containers/ClippyPage';
import SettingsPage from './containers/SettingsPage';
import DbHandler from './clipboarddb/Handler';
import TokenPage from './containers/TokenPage';

/*

  Instantiating the Database handler inside
  of the parent Component to avoid 2 instances being created
  down in the parent child chain.

*/

const userPath = ipcRenderer.sendSync('get-userpath', 'i');

export default class Routes extends Component {
  constructor() {
    super();
    this.DbHandler = new DbHandler(userPath);
  }

  componentWillUnmount() {
    console.log('Unmounting');
  }

  insertData(data, date) {
    return this.DbHandler.insertClipboardData(data, date);
  }

  getAllData(amount) {
    return this.DbHandler.getAllData(amount);
  }

  resetTable() {
    return this.DbHandler.resetTable();
  }

  closeConnection() {
    return this.DbHandler.closeConnection();
  }

  insertToken(token) {
    return this.DbHandler.insertToken(token);
  }

  getToken() {
    return this.DbHandler.getAuthToken();
  }

  render() {
    return (
      <App>
        <Switch>
          <Route
            exact
            path={routes.CLIPPY}
            render={() => (
              <ClippyPage
                insertData={this.insertData.bind(this)}
                getAllData={this.getAllData.bind(this)}
                closeConnection={this.closeConnection.bind(this)}
              />
            )}
          />
          <Route
            exact
            path={routes.SETTINGS}
            render={() => (
              <SettingsPage resetTable={this.resetTable.bind(this)} />
            )}
          />
          <Route
            exact
            path={routes.TOKEN}
            render={() => (
              <TokenPage
                insertToken={this.insertToken.bind(this)}
                getToken={this.getToken.bind(this)}
              />
            )}
          />
        </Switch>
      </App>
    );
  }
}
