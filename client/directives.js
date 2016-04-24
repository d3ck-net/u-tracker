tracku.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

tracku.directive('tagAutoComplete', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr, ctrl) {
            // elem is a jquery lite object if jquery is not present,
            // but with jquery and jquery ui, it will be a full jquery object.
            elem.autocomplete({
                minLength: 0,
                delay: 0,
                source: function (term, cb) {

                    var tags = Tags.find().fetch();
                    var res = tags.sort(function (a, b) {
                        return a.name.distance(term.term) - b.name.distance(term.term);
                    });

                    res = res.map(function (tag) {
                        return {label: tag.name, value: tag.name, data: tag};
                    });

                    res = res.slice(0,10);

                    cb(res);
                },
                select: function (event, ui) {

                    var modelAccessor = $parse(attr.ngModel);
                    scope.$apply(function (scope) {
                        modelAccessor.assign(scope, ui.item.value);
                    });

                    elem.val(ui.item.value);

                    event.preventDefault();
                }
            });
        }
    };
});