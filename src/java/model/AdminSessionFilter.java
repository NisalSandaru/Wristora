
package model;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebFilter(filterName = "AdminSessionFilter" , urlPatterns = {"/adminSign-in.html"})
public class AdminSessionFilter implements Filter{
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
       
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        
        HttpSession s = req.getSession(false);

        if(s != null && s.getAttribute("admin")!=null){
            resp.sendRedirect("adminDash.html");
        }else{
            chain.doFilter(request, response);
        }
        
    }

    @Override
    public void destroy() {
        
    }
}
