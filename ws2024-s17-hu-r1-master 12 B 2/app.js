let app = angular.module('calculatorApp', []);
app.controller('CalculatorController', function($scope, $http){
    $http.get('stages.json')
    .then(function(response){
        $scope.stages = response.data;
        //console.log($scope.stages);
    });

    //a 10 sor megjelenítése
    $scope.teamMembers = [];
    for (let i = 0; i < 10; i++) {
        $scope.teamMembers.push(
            {
                firstName: '',
                lastName: '',
                speed:'',
                totalDistance: 0
            })        
    }

    //a futók nevének össze állítása a kiválasztásra
    $scope.updateRunners = function(){
        $scope.runners = [];
        angular.forEach($scope.teamMembers, function(member){
            let fullName = member.firstName + ' ' + member.lastName;
            //egyforma név ne kerülhessen be
            if($scope.runners.indexOf(fullName) === -1){
                $scope.runners.push(fullName);
            }
        })
    }

    //a beírt idő formázása
    $scope.formatTime = function(member){
        if(member.speed && member.speed.length === 4){
            member.speed = member.speed.slice(0,2) + ':' + member.speed.slice(2);
        }
    }

    //kiválasztott futó sebessége
    $scope.getRunnerSpeed = function(runner){
        let selectedRunner = $scope.teamMembers.find(member =>{
            return member.firstName + ' '+ member.lastName === runner;
        });
        if(!selectedRunner || !selectedRunner.speed){
            return 0;
        }
        //szétválasztjuk a percet és a másodpercet
        let [minutes, second] = selectedRunner.speed.split(':');
        //átalakítás másodpercé
        let totalSecond = parseInt(minutes) *60 + parseInt(second);
        console.log(totalSecond)
        return totalSecond;
      
    }

    //adott távon a futó sebessége
    $scope.calculateTime = function(distance, speed){
        //érvényes e a két szám
        if(isNaN(distance) || isNaN(speed) || speed <=0){
            return '00:00:00';
        }
        let timeMinutes = (distance * speed) / 60;
        let hours = Math.floor(timeMinutes / 60);
        let minutes = Math.floor(timeMinutes % 60);
        let seconds = Math.floor(timeMinutes % 1) * 60;


        let formattedTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
            return formattedTime;
    }
    //össze gyüjtjük a távokat 
    $scope.runnerDistance =  {};
    for (let i = 0; i < 10; i++) {
        $scope.runnerDistance['runner' + 1]=0;
    }
    $scope.calculateTotalDistance= function(distance, runner){
        console.log("Futó neve", runner, "lefutott tav", distance);
        if(!runner){
            return 0;
        }
        let totalDistance = 0;
        $scope.stages.forEach(stage =>{
            totalDistance += stage.distance;
            console.log(totalDistance);
            $scope.runnerDistance[runner] = totalDistance;
            
        })
    }

});