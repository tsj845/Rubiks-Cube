class Block {
    constructor (tags, elem) {
        this._tags = tags;
        this.out = elem;
        this._au = false;
        this._auid = null;
        this._austop = false;
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
    _set_au (auid, stop) {
        this._auid = auid;
        this._au = true;
        if (stop) {
            this._austop = true;
        }
    }
    get tags () {
        return this._tags;
    }
    set tags (v) {
        if (this._au) {
            console.log("tags au", this._auid, v);
            if (this._austop) {
                throw "tags au stop";
            }
        }
        this._tags = v;
    }
    has (tag) {
        return this.tags.indexOf(tag) > -1;
    }
    change (o, n) {
        this.tags[this.tags.indexOf(o)] = n;
    }
    fp () {
        if (this.tags === undefined) {
            return undefined;
        }
        // console.log(this.tags.join(""));
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
    "001":{"00":"021","01":"201","20":"021","21":"00-1","40":"00-1","41":"201"},
    "101":{"00":"011","01":"211","40":"000","41":"200"},
    "201":{"00":"001","01":"221","30":"221","31":"20-1","40":"001","41":"20-1"},
    "011":{"00":"121","01":"101","20":"020","21":"000"},
    "211":{"00":"101","01":"121","30":"220","31":"200"},
    "021":{"00":"221","01":"001","20":"02-1","21":"001","50":"02-1","51":"221"},
    "121":{"00":"211","01":"011","50":"020","51":"220"},
    "221":{"00":"201","01":"021","30":"22-1","31":"201","50":"021","51":"22-1"},
    "00-1":{"10":"02-1","11":"20-1","20":"001","21":"02-1","40":"20-1","41":"001"},
    "10-1":{"10":"01-1","11":"21-1","40":"200","41":"000"},
    "20-1":{"10":"00-1","11":"22-1","30":"201","31":"22-1","40":"201","41":"00-1"},
    "000":{"20":"01-1","21":"011","40":"10-1","41":"101"},
    "200":{"30":"21-1","31":"211","40":"101","41":"10-1"},
    "01-1":{"20":"000","21":"020","10":"12-1","11":"10-1"},
    "21-1":{"30":"200","31":"220","10":"10-1","11":"12-1"},
    "02-1":{"10":"22-1","11":"00-1","20":"00-1","21":"021","50":"22-1","51":"021"},
    "12-1":{"10":"21-1","11":"01-1","50":"20","51":"010"},
    "22-1":{"10":"20-1","11":"02-1","30":"20-1","31":"221","50":"221","51":"02-1"},
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
    "20":"0-90",
    "21":"090",
    "30":"0-90",
    "31":"090",
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
            const d = get_bdata(c);
            if (i === 12) {
                console.log(d[0]);
            }
            this.blocks.push(new Block(...d));
        }
    }
    get_tagged (tag) {
        // console.log(tag);
        let ret = [];
        for (let i in this.blocks) {
            const b = this.blocks[i];
            // console.log(b.tags, i);
            if (b.has(tag)) {
                ret.push(b);
            }
        }
        return ret;
    }
    rot_b (side, dir, block) {
        // console.log(side, dir);
        const tag = side+dir;
        const toparse = rotdird[tag];
        const tind = Number(toparse[0]);
        const ram = Number(toparse.slice(1));
        const e = block.out;
        let cv = get_rot(e, tind);
        cv += ram;
        cv = cv < 0 ? cv + 360 : cv;
        cv = cv % 360;
        set_rot(e, tind, cv);
        const rd = rotd[block.fp()];
        // console.log(rd, tag, block.fp());
        block.tags = tftagd[rd[tag]];
    }
    rotate (side, dir) {
        dir = dir === undefined ? false : dir;
        dir = dir ? "1" : "0";
        side = side === undefined ? 0 : side;
        const tag = this.idttd[side];
        let blocks = this.get_tagged(tag);
        for (let i in blocks) {
            // console.log(i, blocks[i].fp());
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
            console.log(i, b.tags);
            if (!b.has(tag)) {
                this.blocks[i].hidden = true;
                // this.blocks[i].kill();
                // this.blocks.splice(i, 1);
            }
        }
    }
    set_focus (tag) {
        this.unfocus();
        this.focus_tag(tag);
    }
    dump () {
        for (let i in this.blocks) {
            const b = this.blocks[i];
            console.log(i, b.tags, b.fp());
        }
    }
    find (pos) {
        for (let i in this.blocks) {
            const b = this.blocks[i];
            if (b.fp() === pos) {
                console.log(pos, i);
                return true;
                // break;
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
        // console.log(c);
        return c;
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

// cube.blocks[25]._set_au("b25", false);

// console.log(cube.blocks[22].tags, cube.blocks[22].fp());

// cube.focus_tag("right");

// cube.blocks[12]._set_au("b12", true);
// cube.blocks[7]._set_au("b7");
// cube.blocks[8]._set_au("b8");

cube.rotate(0, true);
// console.log(cube.blocks[22].tags);
// cube.check_whole();
// cube.find("20-1");
// cube.rotate(3, true);
// console.log(cube.blocks[22].tags);
// cube.check_whole();
// cube.blocks[12]._set_au("b12");
// cube.rotate(5, true);
// console.log(cube.blocks[22].tags);
cube.focus_tag("top");
// cube.focus_tag("left");