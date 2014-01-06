module.exports = function(grunt) {

    // Grunt configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        fileName: 'extractor',
        pathBuild: 'build',
        pathSrc: 'src',

        banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
            ' * <%= pkg.homepage %> (license: <%= pkg.license %>)\n' +
            ' * (c) <%= grunt.template.today("yyyy") %> <%= pkg.copyright %>\n' +
            ' */\n',

        clean: {
            build: ['<%= pathBuild %>/*'],
            jasmine: ['.grunt', '_SpecRunner.html'],
            temp: ['<%= pathBuild %>/_*.js']
        },

        jasmine: {
            build: {
                src: ['<%= pathBuild %>/<%= fileName %>.js'],
                options: {
                    specs: ['test/extractorSpec.js', 'test/patternsSpec.js']
                }
            },
            buildMin: {
                src: ['<%= pathBuild %>/<%= fileName %>.min.js'],
                options: {
                    specs: ['test/extractorSpec.js', 'test/patternsSpec.js']
                }
            },
            dev: {
                src: ['<%= pathSrc %>/<%= fileName %>.js'],
                options: {
                    keepRunner: true,
                    specs: ['test/*Spec.js']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            dev: {
                files: {
                    src: '<%= pathSrc %>/<%= fileName %>.js'
                }
            }
        },

        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'version',
                            replacement: '<%= pkg.version %>'
                        },
                        {
                            match: /\/\*\s*@inject\s+extractor\.js\s*\*\//,
                            replacement: grunt.file.read('src/extractor.js'),
                            expression: true
                        }
                    ]
                },
                files: [
                    {src: ['<%= pathSrc %>/wrapper.js'], dest: '<%= pathBuild %>/_<%= fileName %>.js'}
                ]
            }
        },

        uglify: {
            dev: {
                options: {
                    banner: '<%= banner %>',
                    beautify: true,
                    mangle: false
                },
                files: {
                    '<%= pathBuild %>/<%= fileName %>.js': ['<%= pathBuild %>/_<%= fileName %>.js']
                }
            },
            build: {
                options: {
                    banner: '<%= banner %>',
                    report: 'gzip'
                },
                files: {
                    '<%= pathBuild %>/<%= fileName %>.min.js': ['<%= pathBuild %>/_<%= fileName %>.js']
                }
            }
        },

        watch: {
            files: ['<%= pathSrc %>/<%= fileName %>.js'],
            tasks: ['build']
        }

    });

    // Load plugins.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');

    // Register task(s).
    grunt.registerTask('build', 'Build script.', ['test-dev', 'wrap', 'uglify', 'clean:temp', 'test-build']);
    grunt.registerTask('default', 'Default task - test and watch.', ['test-dev', 'watch']);
    grunt.registerTask('test-build', 'Run build tests.', ['clean:jasmine', 'jasmine:build', 'jasmine:buildMin']);
    grunt.registerTask('test-dev', 'Run dev tests.', ['clean:jasmine', 'jshint', 'jasmine:dev']);
    grunt.registerTask('wrap', 'Wrap file.', ['clean:build', 'replace']);
};
