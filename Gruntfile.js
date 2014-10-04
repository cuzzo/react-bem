module.exports = function(grunt) {
  grunt.initConfig({
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: "example/jsx",
            src: ["**/*.jsx"],
            dest: "example/components",
            ext: ".js"
          }
        ]
      }
    },

    mocha: {
      options: {
        reporter: 'Nyan', // Duh!
        run: true
      }
    },

    watch: {
      react: {
        files: ["example/jsx/**/*.jsx"],
        tasks: ["react"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-react");
  grunt.loadNpmTasks("grunt-mocha");
  grunt.registerTask("test", "Run Mocha tests.", function() {
    // If not --test option is specified, run all tests.
    var test_case = grunt.option("test") || "**/*";

    grunt.config.set("mocha.browser", ["test/" + test_case + ".html"]);
    grunt.task.run("mocha");
  });
  grunt.loadNpmTasks("grunt-contrib-watch");
};
