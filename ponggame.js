//Variables that can be referenced in many functions
    var canvas;
    var canvasContext;
    var ballX = 50;
    var ballY = 50;
    var ballSpeedX = 3;
    var ballSpeedY = 3;
    
    var player1Score = 0;
    var player2Score = 0;
    const WINNING_SCORE = 5;
    
    var showingWinScreen = false;
    
    var paddle1Y = 250;
    var paddle2Y = 250;
    const BALL_RADIUS = 10;
    const PADDLE_HEIGHT = 100;
    const PADDLE_THICKNESS = 10;
    
    function calculateMousePos(evt){
      var rect = canvas.getBoundingClientRect();
      var root = document.documentElement;
      var mouseX = evt.clientX - rect.left - root.scrollLeft;
      var mouseY = evt.clientY - rect.top - root.scrollTop;
      return {
          x:mouseX,
          y:mouseY
      };
      
    }
    
    function handleMouseClick(evt){
      if(showingWinScreen){
          player1Score = 0;
          player2Score = 0;
          showingWinScreen = false;
      }
    }
    
    //Waits for window to load before showing game
    window.onload = function(){
      console.log('Game Starts...')
      //Defines which HTML element is the game board
      canvas = document.getElementById('gameCanvas');
      canvasContext = canvas.getContext('2d');
      //Framerate is defined here
      var framesPerSecond = 60;
      setInterval( function(){
      moveEverything();
      drawEverything();
      }, 1000/framesPerSecond );
      
      //Mouse control
      canvas.addEventListener('mousedown', handleMouseClick);
      
      canvas.addEventListener('mousemove',
                function(evt) {
                  var mousePos = calculateMousePos(evt);
                  paddle1Y = mousePos.y -(PADDLE_HEIGHT/2);
                });
    };
    
    
    function ballReset(){
      if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
      }
      ballSpeedX= 2;
      ballSpeedY= 2;
      //ballSpeedX = -ballSpeedX;
      ballX = canvas.width/2;
      ballY = canvas.height/2;
    }
    
    
    function computerMovement(){
      var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
      if (paddle2YCenter < ballY-35){
        paddle2Y += 6;
      } else if (paddle2YCenter > ballY+35){
        paddle2Y -= 6;
      }
    }
    
    //Ball speed is defined here
    function moveEverything(){
      //stops game if winning condition is met
      if (showingWinScreen){
        return;
      }
      
      computerMovement();
      
      ballX += ballSpeedX;
      ballY += ballSpeedY;
      
      
          
           //Bouncing ball off of left paddle. Taking into account paddle width.
          if ( ballX < PADDLE_THICKNESS + BALL_RADIUS){
                if (ballY > paddle1Y - BALL_RADIUS &&
                      ballY < paddle1Y + PADDLE_HEIGHT + BALL_RADIUS){
                        ballSpeedX = -ballSpeedX;
                        
                        var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
                        ballSpeedY = deltaY * 0.25;
          
                      }
          
          }
          
          
          //Bouncing ball off of right paddle or reset. Taking into account paddle width.
          if ( ballX > canvas.width-PADDLE_THICKNESS - BALL_RADIUS){
                if (ballY > paddle2Y - BALL_RADIUS &&
                      ballY < paddle2Y + PADDLE_HEIGHT + BALL_RADIUS){
                        ballSpeedX = -ballSpeedX;
                        
                        var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
                        ballSpeedY = deltaY * 0.25;
                      }
          }
          
          
          //Bouncing ball off of left paddle or reset
          if ( ballX < 0){
               // if (ballY > paddle1Y &&
                 //     ballY < paddle1Y + PADDLE_HEIGHT){
                   //     ballSpeedX = -ballSpeedX;
                        
                     //   var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
                       // ballSpeedY = deltaY * 0.25;
                      //} else {
                          player2Score++; //must be before ball is reset
                          ballReset();
                          
         //             }
          }
          //Bouncing ball off of right paddle or reset
          if ( ballX > canvas.width){
               // if (ballY > paddle2Y &&
                 //     ballY < paddle2Y + PADDLE_HEIGHT){
                   //     ballSpeedX = -ballSpeedX;
                        
                         
                   //     var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
                          //ballSpeedY = deltaY * 0.25;
                    // } else {
                          player1Score++; //must be before ball is reset
                          ballReset();
                          
           //           }
          }
          
          //Bouncing ball off the sides, taking into account ball radius
          if (ballY < BALL_RADIUS){
              ballSpeedY = -ballSpeedY;
          }
          if (ballY > canvas.height - BALL_RADIUS){
              ballSpeedY = -ballSpeedY;
          }
    }
    
    function drawNet(){
      for( var i = 10; i < canvas.height; i += 40 ){
         colorRect(canvas.width/2-1,i,2,20,'white');
      }
    }
    
    function drawEverything(){
      
      //draws the pitch
      colorRect(0,0,canvas.width,canvas.height,'black');
      
      //stops game if winning condition is met
        if (showingWinScreen){
          
          if (player1Score >= WINNING_SCORE){
            canvasContext.fillStyle = 'white';
          canvasContext.fillText("Left Player Won!", 350,200);
          } else if (player2Score >= WINNING_SCORE){
            canvasContext.fillStyle = 'white';
          canvasContext.fillText("Right Player Won!", 350,200);
          }
          canvasContext.fillStyle = 'white';
          canvasContext.fillText("Click to continue", 350,500);
        return;
        }

      
      //pitch center white line
      //colorRect((canvas.width/2)-1,0,2,canvas.height,'white');
      drawNet();
      
      //left player paddle
      colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
      
      //AI player paddle
      colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
      
     
      //the ball
      colorCircle(ballX,ballY,10,'red');
      
      //scores
      canvasContext.fillStyle = 'white';
      canvasContext.fillText(player1Score, 100,100);
      canvasContext.fillText(player2Score, canvas.width-100,100);
      

      
    }
    
    function colorCircle(centerX, centerY, radius, drawColor){
      canvasContext.fillStyle = drawColor;
      canvasContext.beginPath();
      canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
      canvasContext.fill();
      
    }
    
    function colorRect( leftX, topY, width, height, drawColor){
      canvasContext.fillStyle = drawColor;
      canvasContext.fillRect( leftX, topY, width, height );
      
    }