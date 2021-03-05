export const getBugsWithProgress = (b, data) => {
    let p = [];
    let bwp = [];
    let pool = 0;
    let count = 0;
    let id = data[0].bug_id;
    data.push({ bug_id: "dummy", progress: 0 });

    for (let i = 0; i < data.length; i++) {
        if (data[i].bug_id === id) {
            pool += data[i].progress;
            count++;
        }
        else {
            let o = { bug_id: id, progress: pool / count };
            id = data[i].bug_id;
            pool = 0;
            count = 0;
            i--;
            p.push(o);
        }
    }

    p.forEach(async (item, index) => {
        let o = {};
        o = {...b.find((bug) => item.bug_id === bug.bug_id), progress: item.progress};
        bwp.push(o);
    });

    return bwp;
}