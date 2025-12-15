class HomeController < ApplicationController
  def index
  end

  def about_us
  end

  def admission
    @student = Student.new
  end
end
