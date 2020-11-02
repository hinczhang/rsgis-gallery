<template>
    <div class="project-list">
        <div class="list-border">
            <div :style="vListStyle" v-for="imgList in images" :key="imgList.id">
                <s-card v-for="img in imgList.list" :key="img.src" :img="img.src"></s-card>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import EventProxy from 'eventproxy';
import sCard from './ShowCard';

export default {
    components:{
        sCard
    },
    data() {
        return {
            rawImages: [],
            listNumber: 3,
            itemNumber: 5,
            vListStyle: {
                margin: '0 10px',
                padding: '0',
                display: 'inline-block',
                width: '450px',
                height: '100%',
                'vertical-align': 'top'
            },
            images: [], // [list1, list2, ...]
        }
    },
    watch: {
        itemNumber: function(val, oldVal) {
            // this.getImageLists(this.rawImages, this.listNumber, val).then(images => {
            //     this.images = images;
            // })
            this.appendImageLists();
        }
    },
    methods: {
        appendImageLists(appendNumber = 2) {
            const self = this;
            const listNumber = self.images.length;
            if (listNumber === 0) {
                self.getImageLists(self.listNumber, 5).then(images => {
                    self.images = images
                });
                return;
            } else {
                for (let i=0; i<listNumber; i++) {
                    for (let j=0; j<appendNumber; j++) {
                        self.images[i].list.push(self.rawImages[parseInt(self.rawImages.length * Math.random())])
                    }
                }
                /// todo
                // for (let j = 0; j<self.listNumber; j++) {
                //     for (let i = j + currentNumber; i<totalNumber && i<self.rawImages.length; i++) {
                //         self.images[j].list.push(self.rawImages[i+j]);
                //     }
                // }
            }
        },
        getImageLists(listNumber, itemNumber = 5) {
            return new Promise((resolve, reject) => {
                const epList = new EventProxy().after('list', listNumber, (lists) => {
                    let count = 0;
                    resolve(lists.map(i => {
                        return {
                            id: count++,
                            list: i
                        }
                    }));
                });
                
                for (let i=0; i<listNumber; i++) {
                    const epItem = new EventProxy().after('item', itemNumber, (list) => {
                        epList.emit('list', list)
                    });

                    for (let j=0; j<itemNumber; j++) {
                        setTimeout(() => {
                            epItem.emit('item', this.rawImages[i*itemNumber + j]);
                        }, 300);
                    }
                }
            })
        }
    },
    created() {
        let arr = ['1109561', '869258', '1125136', '2941017', '1702624', '750108', '1895160', '2090704', '1834403', '2014773', '2549944', '1612462', '2568906', '1646870', '1813947', '2946450', '1298684', '1698482', '1451471', '1251828', '950902', '1250426', '2190381', '2533092', '1563256', '2104152', '2388650', '2590585', '104336', '2955027', '2411688', '2541310', '2422269', '2118870', '2486169', '1557183', '1844521', '2043590', '555790', '1874726', '38132', '1343465', '2167131', '2082087', '1430675', '936722', '2130134', '1786769', '1916824', '1687341', '2599245', '1845534', '1033374', '2096700', '1391421', '2356087', '2553358', '2083866', '1029606', '2208836'];
        this.rawImages = arr.map(i => {
            return {
                src: `https://images.pexels.com/photos/${i}/pexels-photo-${i}.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`
            }
        });
        // this.getImageLists(this.rawImages, this.listNumber, this.itemNumber).then(images => {
        //     this.images = images;
        // });
        this.appendImageLists();
    },
    mounted() {
        const self = this;

        const list = $('.project-list');
        const listBorder = list.children();
        // 滚轮事件
        list.scroll( e => {
            if (list.height() + list.scrollTop() > listBorder.height() - 100) {
                self.itemNumber += 2;
            }
        })
    },

}

</script>

<style scoped>
.project-list {
    height: inherit;
    overflow-y: scroll;
    background: url('../assets/img/project-list-bg-small.jpg') bottom left
}
</style>