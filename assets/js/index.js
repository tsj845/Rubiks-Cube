class Block {
    constructor (tags, elem) {
        this.tags = tags;
        this.out = elem;
        this._hidden = false;
    }
    get hidden () {
        return this._hidden;
    }
    set hidden (v) {
        this._hidden = v;
        if (v) {
            this.out.className = "block hidden";
        } else {
            this.out.className = "block";
        }
    }
    has (tag) {
        return this.tags.indexOf(tag) > -1;
    }
    fp () {
        if (this.tags === undefined) {
            return undefined;
        }
        return rtftagd[this.tags.join("")];
    }
}

const tftagd = {
    "001":["front","top","left"],"101":["front","top"],"201":["front","top","right"],"011":["front","left"],"111":["front"],"211":["front","right"],"021":["front","left","bot"],"121":["front","bot"],"221":["front","right","bot"],"000":["top","left"],"100":["top"],"200":["top","right"],"010":["left"],"210":["right"],"020":["left","bot"],"120":["bot"],"220":["right","bot"],"00-1":["top","left","back"],"10-1":["top","back"],"20-1":["top","back","right"],"01-1":["left","back"],"11-1":["back"],"21-1":["right","back"],"02-1":["left","back","bot"],"12-1":["back","bot"],"22-1":["back","right","bot"]
};

const rtftagd = {
    "fronttopleft":"001","fronttop":"101","fronttopright":"201","frontleft":"011","front":"111","frontright":"211","frontleftbot":"021","frontbot":"121","frontrightbot":"221","topleft":"000","top":"100","topright":"200","left":"010","right":"210","leftbot":"020","bot":"120","rightbot":"220","topleftback":"00-1","topback":"10-1","topbackright":"20-1","rightback":"21-1","back":"11-1","leftback":"01-1","leftbackbot":"02-1","backbot":"12-1","backrightbot":"22-1"
};

const rotd = {
    "001":{"00":"021","01":"201","20":"00-1","21":"021","40":"00-1","41":"201"},
    "101":{"00":"011","01":"211","40":"000","41":"200"},
    "201":{"00":"001","01":"221","30":"20-1","31":"221","40":"001","41":"20-1"},
    "011":{"00":"121","01":"101","20":"000","21":"020"},
    "211":{"00":"101","01":"121","30":"200","31":"220"},
    "021":{"00":"221","01":"001","20":"001","21":"02-1","50":"02-1","51":"221"},
    "121":{"00":"211","01":"011","50":"020","51":"220"},
    "221":{"00":"201","01":"021","30":"201","31":"22-1","50":"021","51":"22-1"},
    "00-1":{"10":"02-1","11":"20-1","20":"02-1","21":"001","40":"20-1","41":"001"},
    "10-1":{"10":"01-1","11":"21-1","40":"200","41":"000"},
    "20-1":{"10":"00-1","11":"22-1","30":"22-1","31":"201","40":"201","41":"00-1"},
    "000":{"20":"01-1","21":"011","40":"10-1","41":"101"},
    "200":{"30":"21-1","31":"211","40":"101","41":"10-1"},
    "01-1":{"20":"020","21":"000","10":"12-1","11":"10-1"},
    "21-1":{"30":"220","31":"200","10":"10-1","11":"12-1"},
    "02-1":{"10":"22-1","11":"00-1","20":"021","21":"00-1","50":"22-1","51":"021"},
    "12-1":{"10":"21-1","11":"01-1","50":"220","51":"020"},
    "22-1":{"10":"20-1","11":"02-1","30":"221","31":"20-1","50":"221","51":"02-1"},
    "020":{"20":"011","21":"01-1","50":"12-1","51":"121"},
    "220":{"30":"211","31":"21-1","50":"121","51":"12-1"},
    "111":{"00":"111","01":"111"},
    "100":{"40":"100","41":"100"},
    "010":{"20":"010","21":"010"},
    "210":{"30":"210","31":"210"},
    "120":{"50":"120","51":"120"},
    "11-1":{"10":"11-1","11":"11-1"}
};

const rotdird = {
    "00":"2-90",
    "01":"290",
    "10":"2-90",
    "11":"290",
    "20":"090",
    "21":"0-90",
    "30":"090",
    "31":"0-90",
    "40":"1-90",
    "41":"190",
    "50":"1-90",
    "51":"190"
};

function get_bdata (el) {
    const l = el.style.cssText.split(";").slice(3, 6);
    l[0] = Number(l[0].split(":")[1])/100;
    l[1] = Number(l[1].split(":")[1])/100;
    l[2] = Number(l[2].split(":")[1])/100;
    return [tftagd[l.join("")],el];
}

function get_rot (el, n) {
    return Number(el.style.cssText.split(";")[n].split(":")[1]);
}

function set_rot (el, n, v) {
    let l = el.style.cssText.split(";");
    l[n] = l[n].split(":")[0] + ":" + (v % 360);
    el.style.cssText = l.join(";");
}

function move_faces (el, n, v) {
    let values = [];
    let samples = [];
    if (n === 0) {
        samples = [0, 4, 1, 5];
    } else if (n === 1) {
        samples = [0, 2, 1, 3];
    } else {
        samples = [2, 4, 3, 5];
    }
    for (let x in samples) {
        values.push(el.children[samples[x]].className.split(" ")[2]);
    }
    if ((v < 0 && n < 2) || (v > 0 && n > 1) || (v < 0 && n > 0 && n < 2 && false)) {
        values.push(values.shift());
    } else {
        values.unshift(values.pop());
    }
    for (let x in samples) {
        el.children[samples[x]].className = el.children[samples[x]].className.split(" ").slice(0, 2).join(" ")+" "+values[x];
    }
}

function set_tran (el, v) {
    let l = el.style.cssText.split(";");
    l[3] = l[3].split(":")[0] + ":" + Number(v[0])*100;
    l[4] = l[4].split(":")[0] + ":" + Number(v[1])*100;
    l[5] = l[5].split(":")[0] + ":" + Number(v.slice(2))*100;
    el.style.cssText = l.join(";");
}

class Cube {
    constructor () {
        this.blocks = [];
        this.get_blocks();
        this.idttd = {0:"front",1:"back",2:"left",3:"right",4:"top",5:"bot"};
    }
    get_blocks () {
        this.blocks = [];
        for (let i = 0; i < e.children.length; i ++) {
            const c = e.children[i];
            this.blocks.push(new Block(...get_bdata(c)));
        }
    }
    get_tagged (tag) {
        let ret = [];
        for (let i in this.blocks) {
            const b = this.blocks[i];
            if (b.has(tag)) {
                ret.push(b);
            }
        }
        return ret;
    }
    rot_b (side, dir, block) {
        const tag = side+dir;
        const toparse = rotdird[tag];
        const tind = Number(toparse[0]);
        const ram = Number(toparse.slice(1));
        const e = block.out;
        move_faces(e, tind, ram);
        const rd = rotd[block.fp()];
        block.tags = tftagd[rd[tag]];
        set_tran(e, block.fp());
    }
    rotate (side, dir) {
        dir = dir === undefined ? false : dir;
        dir = dir ? "1" : "0";
        side = side === undefined ? 0 : side;
        const tag = this.idttd[side];
        let blocks = this.get_tagged(tag);
        for (let i in blocks) {
            this.rot_b(side, dir, blocks[i]);
        }
    }
    unfocus () {
        for (let i in this.blocks) {
            this.blocks[i].hidden = false;
        }
    }
    focus_tag (tag) {
        if (typeof tag === "number") {
            tag = this.idttd[tag];
        }
        for (let i = this.blocks.length - 1; i >= 0; i --) {
            const b = this.blocks[i];
            if (!b.has(tag)) {
                this.blocks[i].hidden = true;
            }
        }
    }
    set_focus (tag) {
        this.unfocus();
        this.focus_tag(tag);
    }
    find (pos) {
        for (let i in this.blocks) {
            const b = this.blocks[i];
            if (b.fp() === pos) {
                console.log(pos, i);
                return true;
            }
        }
        return false;
    }
    count (tag) {
        let c = 0;
        for (let i in this.blocks) {
            if (this.blocks[i].fp() === tag) {
                c ++;
            }
        }
        return c;
    }
    focus_block (pos) {
        for (let i in this.blocks) {
            if (this.blocks[i].fp() !== pos) {
                this.blocks[i].hidden = true;
            } else {
                this.blocks[i].hidden = false;
            }
        }
    }
    check_whole () {
        console.log("CUBE INTEG CHECK");
        for (let i in tftagd) {
            if (!this.find(i)) {
                console.log("MISSING", i);
            }
            console.log(this.count(i));
        }
    }
    fbroken () {
        for (let i in this.blocks) {
            if (this.blocks[i].tags === undefined) {
                console.log(i);
            }
        }
    }
    regen () {
        gen_cube();
        this.get_blocks();
    }
}

const cube = new Cube();

let gsid = 0;

function rotcube (dir) {
    if (gsid % 2 !== 0) {
        dir = Math.abs(dir-1);
    }
    cube.rotate(gsid, dir > 0);
}

function scramble (n) {
    n = n === undefined ? 15 : n;
    for (let i = 0; i < n; i ++) {
        cube.rotate(Math.floor(Math.random() * 6), Math.floor(Math.random() * 2) > 0);
    }
}