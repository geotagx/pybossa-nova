TEMPLATES = {
    'animals': {
        steps: [{
            id: 'step1',
            type: 'yesno',
            text: 'Is this photo spam?',
            then_step: 'end',
            else_step: 'step2'
        }, {
            id: 'step2',
            type: 'yesno',
            text: 'Do you see animals in the photo?',
            then_step: 'step3',
            else_step: 'end'
        }, {
            id: 'step3',
            type: 'multiple',
            text: 'What is the animal you are looking at?',
            options: ['Cattle', 'Sheep', 'Donkey', 'Pigs', 'Poultry', 'Oxen', 'I don\'t know'],
            then_step: 'step4'
        }, {
            id: 'step4',
            type: 'yesno',
            text: 'Is the animal alive?',
            then_step: 'step5',
            else_step: 'end'
        }, {
            id: 'step5',
            type: 'multiple',
            text: 'Indicators of good health:',
            options: ['Running', 'Eating', 'Playing', 'Moving', 'I can\'t tell'],
            then_step: 'step6'
        }, {
            id: 'step6',
            type: 'multiple',
            text: 'Indicators of bad health:',
            options: ['Looks skinny', 'Lying down', 'The animal\'s fur is lank', 'I can see the animals ribs', 'I can\'t tell'],
            then_step: 'end'
        }],
        tasks: [{
            img_url: 'http://annesentours.net/wp-content/gallery/angola/dynamic/iona-zebra-nggid03795-ngg0dyn-320x240x100-00f0w010c010r110f110r010t010.jpg'
        }, {
            img_url: 'http://static3.businessinsider.com/image/5238c9c5ecad047f12b2751a/internet-famous-grumpy-cat-just-landed-an-endorsement-deal-with-friskies.jpg'
        }]
    },

    'pokemon': {
        steps: [{
            id: 'step1',
            type: 'yesno',
            text: 'Is there a Pokemon in this picture?',
            then_step: 'step2',
            else_step: 'end'
        }, {
            id: 'step2',
            type: 'multiple',
            text: 'What kind of Pokemon is it?',
            options: ['Water', 'Earth', 'Fire', 'Stone', 'Chewing Gum'],
            then_step: 'end'
        }],

        tasks: [{
            img_url: 'https://pbs.twimg.com/profile_images/378800000822867536/3f5a00acf72df93528b6bb7cd0a4fd0c.jpeg'
        }, {
            img_url: 'http://img.gawkerassets.com/img/193m8hvco32j0jpg/original.jpg'
        }]
    }
};
