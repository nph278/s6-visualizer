convert_swap = (p) => {
    switch (Math.min(p[0], p[1]) * 10 + Math.max(p[0], p[1])) {
    // Triplet of pairs to swap. Tiles go clockwise starting at right point.
    case 01: return [[0,1],[2,3],[4,5]]; // topalt
    case 02: return [[0,5],[1,3],[2,4]]; // trighthat
    case 03: return [[0,3],[1,4],[2,5]]; // star
    case 04: return [[0,4],[1,2],[3,5]]; // bothat
    case 05: return [[0,2],[1,5],[3,4]]; // tlefthat
    case 12: return [[0,2],[1,4],[3,5]]; // slashleft
    case 13: return [[0,5],[1,2],[3,4]]; // botalt
    case 14: return [[0,3],[1,5],[2,4]]; // slashacross
    case 15: return [[0,4],[1,3],[2,5]]; // slashright
    case 23: return [[0,4],[1,5],[2,3]]; // blefthat
    case 24: return [[0,1],[2,5],[3,4]]; // tiltright
    case 25: return [[0,3],[1,2],[4,5]]; // tiltacross
    case 34: return [[0,2],[1,3],[4,5]]; // tophat
    case 35: return [[0,1],[2,4],[3,5]]; // brighthat
    case 45: return [[0,5],[1,4],[2,3]]; // tiltleft
    }
}

window.onload = () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = "20px sans-serif";

    const radius_outer = 75;
    const radius_inner = 20;
    const y = 250;
    const x1 = 125;
    const x2 = 375;

    let on = true;
    let selection = false;
    let set_1 = [0,1,2,3,4,5];
    let set_2 = [0,1,2,3,4,5];

    update = () => {
        ctx.clearRect(0, 0, 500, 500);
        for (let i = 0; i < 6; i++) {
            const this_x1 = x1 + radius_outer * Math.cos(i * Math.PI / 3);
            const this_x2 = x2 + radius_outer * Math.cos(i * Math.PI / 3);
            const this_y = y + radius_outer * Math.sin(i * Math.PI / 3);

            if (i === selection) {
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
            }

            ctx.fillText(set_1[i].toString(), this_x1, this_y);
            ctx.beginPath();
            ctx.arc(this_x1 + 5, this_y - 5, radius_inner, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";

            ctx.fillText(set_2[i].toString(), this_x2, this_y);
            ctx.beginPath();
            ctx.arc(this_x2 + 5, this_y - 5, radius_inner, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    update();
    canvas.onmousemove = () => {
        if (on) {
            update();
        }
    };

    click = event => {
        if (on) {
            const this_x = event.offsetX - x1;
            const this_y = event.offsetY - y;
            const ylevel = Math.round(Math.asin(this_y / Math.sqrt(this_x * this_x + this_y * this_y)) / (Math.PI / 3)) + 1 - 1;

            let next_selection = 0;
            if (this_x > 0) {
                if (ylevel === -1) {
                    next_selection = 5;
                } else {
                    next_selection = ylevel;
                }
            } else {
                next_selection = 3 - ylevel;
            }

            if (selection !== next_selection && typeof selection === "number") {
                const selected_pair = [selection, next_selection];
                const l1 = [selected_pair];
                const l2 = convert_swap(selected_pair);

                l1.forEach(p => {
                    ctx.beginPath();
                    ctx.moveTo(x1 + radius_outer * Math.cos(p[0] * Math.PI / 3) + 5,
                               y + radius_outer * Math.sin(p[0] * Math.PI / 3) - 5);
                    ctx.lineTo(x1 + radius_outer * Math.cos(p[1] * Math.PI / 3) + 5,
                               y + radius_outer * Math.sin(p[1] * Math.PI / 3) - 5);
                    ctx.stroke();
                });

                l2.forEach(p => {
                    ctx.beginPath();
                    ctx.moveTo(x2 + radius_outer * Math.cos(p[0] * Math.PI / 3) + 5,
                               y + radius_outer * Math.sin(p[0] * Math.PI / 3) - 5);
                    ctx.lineTo(x2 + radius_outer * Math.cos(p[1] * Math.PI / 3) + 5,
                               y + radius_outer * Math.sin(p[1] * Math.PI / 3) - 5);
                    ctx.stroke();
                });

                on = false;

                setTimeout(() => {
                    l1.forEach(p => {
                        const tmp = set_1[p[0]];
                        set_1[p[0]] = set_1[p[1]];
                        set_1[p[1]] = tmp;
                    });

                    l2.forEach(p => {
                        const tmp = set_2[p[0]];
                        set_2[p[0]] = set_2[p[1]];
                        set_2[p[1]] = tmp;
                    });

                    update();
                    on = true;
                }, 1000);

                selection = false;
            } else {
                selection = next_selection;
            }
        }
    }

    canvas.onclick = click;
}
