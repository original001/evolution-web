import {Map, List, fromJS} from 'immutable';
import {UserModel} from '../models/UserModel';
import {
  SOCKET_DISCONNECT_NOW
  , server$injectUser
  , loginUserFormRequest
  , loginUserTokenRequest
  , roomCreateRequest
  , roomStartVotingRequest
} from './actions';
// const {ObjectId} = require('mongodb');
import request from 'request';
const {ObjectId} = require('mongodb');
import {server$oauthVKRegister} from '../../server/actions/oauth';
import * as database from '../../server/actions/db';

//await new Promise(resolve => setTimeout(resolve, 1));

describe('Auth:', function () {
  // this.timeout(20000)
  describe('Oauth:', () => {
    it('VK', async () => {
      const sandbox = sinon.sandbox.create();
      const serverStore = mockServerStore();
      const clientStore0 = mockClientStore().connect(serverStore);
      const clientStore1 = mockClientStore().connect(serverStore);
      // Stubs
      sinon.stub(request, 'get')
        .onCall(0).yields(null, {body: {access_token: '1', expires_in: 1, user_id: '1'}})
        .onCall(1).yields(null, {body: {response: [{}]}})
        .onCall(2).yields(null, {body: {access_token: '1', expires_in: 1, user_id: '1'}})
        .onCall(3).yields(null, {body: {response: [{}]}})
      ;
      sinon.stub(database, 'db$findUser').resolves({
        _id: ObjectId()
        , name: 'Test Testovich'
      });
      sinon.stub(database, 'db$registerUser').resolves();
      sinon.stub(database, 'db$updateUser').resolves();
      //

      const token0 = await serverStore.dispatch(server$oauthVKRegister(null, null, 'abcd'));

      await clientStore0.dispatch(loginUserTokenRequest(null, token0));
      // sandbox.spy(UserModel, 'new');
      clientStore0.dispatch(roomCreateRequest());
      clientStore0.dispatch(roomStartVotingRequest());
      expect(clientStore0.getState().game).ok;
      clientStore0.disconnect();

      const token1 = await serverStore.dispatch(server$oauthVKRegister(null, null, 'abcd'));

      await clientStore1.dispatch(loginUserTokenRequest(null, token1));
      expect(clientStore1.getState().game).ok;

      clientStore1.disconnect(SOCKET_DISCONNECT_NOW);

      sandbox.restore();
    });
  });
});