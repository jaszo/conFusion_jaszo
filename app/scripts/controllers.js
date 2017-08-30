'use strict';
angular.module('confusionApp')

  .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;

    $scope.showMenu = false;
    $scope.message = "Loading ...";

    $scope.dishes = menuFactory.getDishes()
      .query(
        function(response) {
          $scope.dishes = response;
          $scope.showMenu = true;
        },
        function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
        }
      );

    $scope.select = function(setTab) {
      this.tab = setTab;
      if (setTab === 2) {
        this.filtText = "appetizer";
      }
      else if (setTab === 3) {
        this.filtText = "mains";
      }
      else if (setTab === 4) {
        this.filtText = "dessert";
      }
      else {
        this.filtText = "";
      }
    };

    $scope.isSelected = function (checkTab) {
      return (this.tab === checkTab);
    };

    $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
    };
  }])

  .controller('ContactController', ['$scope', function($scope) {
    $scope.feedback = {
      mychannel:"",
      firstName:"",
      lastName:"",
      agree:false,
      email:""
    };
    var channels = [
      { value:"tel", label:"Tel."},
      {value:"Email",label:"Email"}
    ];
    $scope.channels = channels;
    $scope.invalidChannelSelection = false;
  }])

  .controller('FeedbackController', ['$scope', function($scope) {
    $scope.sendFeedback = function() {
      console.log($scope.feedback);
      if ($scope.feedback.agree && ($scope.feedback.mychannel === "")&& !$scope.feedback.mychannel) {
        $scope.invalidChannelSelection = true;
        console.log('incorrect');
      } else {
        $scope.invalidChannelSelection = false;
        $scope.feedback = {
          mychannel:"",
          firstName:"",
          lastName:"",
          agree:false,
          email:""
        };
        $scope.feedback.mychannel="";
        $scope.feedbackForm.$setPristine();
        console.log($scope.feedback);
      }
    };
  }])

  .controller('DishDetailController', ['$scope', /*'$routeParams',*/'$stateParams', 'menuFactory', function($scope, /*$routeParams,*/ $stateParams, menuFactory) {
    $scope.submitComment = function() {
      // We assume that the content of the form
      // is all valid at this point. So it is safe to
      // push the comment content to the dish comments.

      //
      // Setting the date in the format Dec. 02, 2011
      //
      var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];

      var date = new Date();
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      console.log(day, monthNames[monthIndex], year);
      var fullDate = monthNames[monthIndex] + '. ' + day + ', ' + year;
      $scope.yourcomment.date = fullDate;
      console.log($scope.yourcomment);

      // Push the new comment to the list of comments.
      $scope.dish.comments.push($scope.yourcomment);
      // To update the JSON data and persist
      menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
      // Setting a new comment object
      $scope.yourcomment = {
        rating: 5,
        comment: "",
        author: "",
        date: ""
      };
      // Form should be in its pristine mode.
      $scope.commentForm.$setPristine();
      console.log($scope.dish);
      console.log($scope.yourcomment);
    };

    $scope.sort = '';
    $scope.yourcomment = {
      rating: 5,
      comment: "",
      author: "",
      date: ""
    };
    // $scope.dish= menuFactory.getDish(3);
    // var dish= menuFactory.getDish(parseInt($routeParams.id,10));
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.getDishes()
      .get({id:parseInt($stateParams.id,10)})
      .$promise.then(
        function(response) {
          $scope.dish = response;
          $scope.showDish = true;
        },
        function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
        }
      );
  }])

  // Task 2
  // implement the IndexController and AboutController
  .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.getDishes()
      .get({id:0})
      .$promise.then(
        function(response) {
          $scope.dish = response;
          $scope.showDish = true;
        },
        function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
        }
      );

    $scope.promotion = menuFactory.getPromotion(0);
    $scope.leader = corporateFactory.getLeader(3);
  }])

  .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
    $scope.leadership = corporateFactory.getLeadership();
  }])
;
