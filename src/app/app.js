import $ from 'jquery';
import _ from 'lodash';
import 'bootstrap';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-breadcrumb';
import 'angular-ui-bootstrap';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import {logConfig} from './log.config';

//Set this variable if you are using security, and need to configure a context root.
//window.krBaseUrl = 'context-root';

let appModule = angular.module('app', [
	'ui.router',
  'ncy-angular-breadcrumb',
	'ui.bootstrap',
	Common.name,
	Components.name
])
.directive('app', AppComponent)
.config(logConfig)
.config(/*@ngInject*/function ($uiViewScrollProvider, $urlRouterProvider) {
  $uiViewScrollProvider.useAnchorScroll();
  $urlRouterProvider.otherwise("/");
})
.config(/*@ngInject*/($breadcrumbProvider)=>{
  $breadcrumbProvider.setOptions({
    prefixStateName: 'home',
    template: 'bootstrap3'
  });
})
.run(/*@ngInject*/function ($rootScope, $state, $stateParams, $anchorScroll, $log) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
    $anchorScroll('page');
  });
  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    $log.error('$stateChangeError:', event, toState, toParams, fromState, fromParams, error);
    if (error) {
      throw error;
    }
  });
  $rootScope.$on('$stateChangeSuccess', (event, to, toParams, from, fromParams) => {

    //For convenience set where you came from where you are and where you are going
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;
    $rootScope.fromParams = fromParams;
    $log.debug('$stateChangeSuccess - name:', to.name);
  });
  $rootScope.$on('$stateNotFound', (event, unfoundState, fromState, fromParams)=> {
    $log.warn('$stateNotFound', {
      event: event,
      unfoundState: unfoundState,
      fromState: fromState,
      fromParams: fromParams
    });
  });
})
.run(/*@ngInject*/($rootScope, $state) => {
    $rootScope.isActive = function(stateName) {
      return $state.includes(stateName);
    };

    $rootScope.getLastStepLabel = function() {
      return 'Angular-Breadcrumb';
    };
});


export default appModule;
