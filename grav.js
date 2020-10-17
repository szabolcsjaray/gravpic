function el(id) {
    return document.getElementById(id);
}

var context;

function setP(x,y,r,g,b,a) {
    context.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
    context.fillRect( x, y, 1, 1 );
}

var ps = [[200,200, 10000,  2,-1],
    [800, 100, 20000,       0,1],
    [400, 500, 10000,       -2,-1],
    [700,560, 1000,         0,0],
    [900, 850, 1500,        1,-6],
    [290, 800, 1050,          8,4]];


function getAcc(x,y,x1,y1, m) {
    let dist2 = (x-x1)*(x-x1)+(y-y1)*(y-y1);
    let dist = Math.sqrt(dist2);
    av = 1000*(m/dist2);
    return [av*(x1-x)/dist, av*(y1-y)/dist, av];

}

function getGravy(x,y, excl = -1) {
    let ax = 0;
    let ay = 0;
    for (let i = 0; i <ps.length; i++) {
        if (i!=excl) {
            let av = getAcc(x,y,ps[i][0], ps[i][1], ps[i][2]);
            ax += av[0];
            ay += av[1];
        }
    }
    return [Math.sqrt(ax*ax+ay*ay), ax, ay];
}

var w, h;
var pphi = 0;
var imn = -1;


function drawIt() {
    if ((imn>-1) && (imn<31)) {
        saveImage();
    }
    imn++;
    for (let x = 0;x<w;x=x+1) {
        for(let y = 0;y<h;y=y+1) {
            let gf = getGravy(x,y);
            f = Math.round(gf[0]*1.2)%255;
            let phi = Math.atan2(gf[2],gf[1]);
            phi = (phi<0 ? phi + 2*Math.PI : phi);
            let col = Math.round((phi+pphi)/(2*Math.PI)*6055)%255;
            //console.log(f);
            setP(x,y, col,Math.round((((col+140)*2)%255)/2), f,255);
        }
    }
    for(let i=0;i<ps.length;i++) {
        let av = getGravy(ps[i][0], ps[i][1], i);
        ps[i][3]+=av[1]/ps[i][2];
        ps[i][4]+=av[2]/ps[i][2];
        ps[i][0]+=ps[i][3];
        ps[i][1]+=ps[i][4];
        context.fillRect(ps[i][0]-2, ps[i][1]-2, 5, 5);
    }

    pphi += 0.01;
    setTimeout(drawIt, 2000);
}

var link;

function saveImage() {
    link = document.getElementById('link');
    link.setAttribute('download', 'grav'+("0000" + imn).slice(-4)+'.png');
    link.setAttribute('href', el("pic").toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
}

function init() {
    let pic = el("pic");
    context = pic.getContext("2d");
    context.fillStyle = "white";
    context.clearRect(0, 0, pic.width, pic.height);
    h = pic.height;
    w = pic.width;
    drawIt();
}