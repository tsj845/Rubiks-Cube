// testing
// green white orange
make_block([0, 2, 4], [200, 0, 100]);
t = true;

// centers
// green center
make_block([0], [100, 100, 100]);
// blue center
make_block([1], [100, 100, -100]);
// orange center
make_block([2], [200, 100, 0]);
// red center
make_block([3], [0, 100, 0]);
// white center
make_block([4], [100, 0, 0]);
// yellow center
make_block([5], [100, 200, 0]);

// edges
// green white
make_block([0, 4], [100, 0, 100]);
// green orange
make_block([0, 2], [200, 100, 100]);
// green yellow
make_block([0, 5], [100, 200, 100]);
// green red
make_block([0, 3], [0, 100, 100]);
// blue white
make_block([1, 4], [100, 0, -100]);
// blue orange
make_block([1, 2], [200, 100, -100]);
// blue yellow
make_block([1, 5], [100, 200, -100]);
// blue red
make_block([1, 3], [0, 100, -100]);
// white orange
make_block([2, 4], [200, 0, 0]);
// white red
make_block([3, 4], [0, 0, 0]);
// yellow orange
make_block([2, 5], [200, 200, 0]);
// yellow red
make_block([3, 5], [0, 200, 0]);

// corners
// green yellow orange
make_block([0, 2, 5], [200, 200, 100]);
// green yellow red
make_block([0, 3, 5], [0, 200, 100]);
// green white red
make_block([0, 3, 4], [0, 0, 100]);
// blue white orange
make_block([1, 2, 4], [200, 0, -100]);
// blue yellow orange
make_block([1, 2, 5], [200, 200, -100]);
// blue yellow red
make_block([1, 3, 5], [0, 200, -100]);
// blue white red
make_block([1, 3, 4], [0, 0, -100]);